package managers;

import daos.AdditionalSpecsFieldDAO;
import daos.EquipmentDAO;
import daos.EquipmentTypeDAO;
import daos.PriceSuggestionModelTrainingLogDAO;
import entities.*;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.factory.Nd4j;
import org.nd4j.linalg.inverse.InvertMatrix;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.ws.rs.InternalServerErrorException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.List;
import java.util.logging.Logger;

@Stateless
public class PriceSuggestionCalculator {


	private static final int DEFAULT_EQUIPMENT_TYPE_ID = 4;
	private static final Logger LOGGER = Logger.getLogger(PriceSuggestionCalculator.class.toString());

	@Inject
	EquipmentDAO equipmentDAO;

	@Inject
	EquipmentTypeDAO equipmentTypeDAO;


	@Inject
	AdditionalSpecsFieldDAO additionalSpecsFieldDAO;

	@Inject
	PriceSuggestionModelTrainingLogDAO logDAO;

	private INDArray calculateTheta(double[][] xTrainInput, double[] yTrainInput) {

		INDArray xTrain = Nd4j.create(xTrainInput);
		INDArray yTrain = Nd4j.create(yTrainInput).transpose();
		int n = xTrain.rows();
		// TODO: 4/22/19 append bias to xTrain
		INDArray bias = Nd4j.ones(n, 1);
		xTrain = Nd4j.hstack(bias, xTrain);

		//(XTX)^-1 XTY
		INDArray theta1 = InvertMatrix.pinvert(xTrain.transpose().mmul(xTrain), false);
		INDArray theta2 = theta1.mmul(xTrain.transpose());
		INDArray theta = theta2.mmul(yTrain);

		System.out.println("calculateTheta Theta: " + theta.shapeInfoToString());

		return theta;
	}

	public INDArray calculateTheta(long equipmentTypeId) {
		LOGGER.info("training model for equipmentTypeId=" + equipmentTypeId);
		List<EquipmentEntity> equipments = equipmentDAO.getEquipmentsByEquipmentTypeId(equipmentTypeId, true);

		//excluded deleted fields
		List<AdditionalSpecsFieldEntity> fields = additionalSpecsFieldDAO.getFieldsByEquipmentType(equipmentTypeId,false);

		if (fields.isEmpty()) {
			//no calculatable field
			LOGGER.warning("No calculatable fields found with equipmentTypeId=" + equipmentTypeId);
			return null;
		}
		// TODO: 4/23/19 get train data from database
		double[][] xTrain = new double[equipments.size()][fields.size()];
		double[] yTrain = new double[equipments.size()];
		for (int i = 0; i < equipments.size(); i++) {
			EquipmentEntity equipmentEntity = equipments.get(i);
			yTrain[i] = equipmentEntity.getDailyPrice();
			for (AdditionalSpecsValueEntity additionalSpecsValue : equipmentEntity.getAdditionalSpecsValues()) {

				int j = fields.indexOf(additionalSpecsValue.getAdditionalSpecsField());
				if (j == -1) {
					continue;
				}
				// this might throw some shitty thing
				double value = Double.parseDouble(additionalSpecsValue.getValue());
				xTrain[i][j] = value;
			}


		}


		INDArray theta = calculateTheta(xTrain, yTrain);

		double testRate = testRate(theta, equipments,fields);

		double[] thetaVector = theta.toDoubleVector();
		// TODO: 4/23/19 insert theta to db
		PriceSuggestionModelTrainingLogEntity logEntity = new PriceSuggestionModelTrainingLogEntity();
		logEntity.setEquipmentTypeId(equipmentTypeId);
		logEntity.setFromDate(LocalDate.now().minus(6, ChronoUnit.MONTHS));
		logEntity.setToDate(LocalDate.now());
		logEntity.setTestingRate(testRate);


		//set bias weight
		EquipmentTypeEntity equipmentTypeEntity = equipmentTypeDAO.findByIdWithValidation(equipmentTypeId);
		double biasWeight = thetaVector[0];
		equipmentTypeEntity.setPriceWeight(biasWeight);
		equipmentTypeDAO.merge(equipmentTypeEntity);
		//thetaVector = xVector + bias

		for (int i = 0; i < thetaVector.length; i++) {
			double weight = thetaVector[i];

			//because of bias weight
			if (i == 0) {
				PriceSuggestionModelTrainingLogDetailEntity logDetailEntity = new PriceSuggestionModelTrainingLogDetailEntity();
				logDetailEntity.setAdditionalSpecsFieldId(null);
				logDetailEntity.setWeight(weight);
				logEntity.addDetails(logDetailEntity);
			} else {

				AdditionalSpecsFieldEntity updatingField = fields.get(i - 1);
				updatingField.setPriceWeight(weight);
				additionalSpecsFieldDAO.merge(updatingField);

				PriceSuggestionModelTrainingLogDetailEntity logDetailEntity = new PriceSuggestionModelTrainingLogDetailEntity();
				logDetailEntity.setAdditionalSpecsFieldId(updatingField.getId());
				logDetailEntity.setWeight(weight);
				logEntity.addDetails(logDetailEntity);
			}

		}

		// TODO: 4/23/19 insert training result to db
		logDAO.persist(logEntity);
		LOGGER.info("Insert PriceSuggestionModelTrainingLogEntity to db, id=:" + logEntity.getId());
		return theta;


	}

	public double testRate(INDArray theta,List<EquipmentEntity> equipments , List<AdditionalSpecsFieldEntity> fields) {
//		List<EquipmentEntity> equipments = equipmentDAO.getEquipmentsByEquipmentTypeId(equipmentTypeId);
//		List<AdditionalSpecsFieldEntity> fields = additionalSpecsFieldDAO.getFieldsByEquipmentType(equipmentTypeId);
		if (equipments.isEmpty()) {
			return 0;
		}
//		double sum = 0;
		double residualSum = 0;
		double totalSumOfSquare = 0;
		double y_mean = 0;
		//calculate y_mean
		for (EquipmentEntity equipment : equipments) {
			y_mean += equipment.getDailyPrice();
		}
		y_mean = y_mean / equipments.size();

		for (EquipmentEntity equipment : equipments) {
			double[] x = new double[fields.size()];
			for (AdditionalSpecsValueEntity additionalSpecsValue : equipment.getAdditionalSpecsValues()) {
				int j = fields.indexOf(additionalSpecsValue.getAdditionalSpecsField());
				if (j == -1) {
					continue;
				}
				x[j] = Double.parseDouble(additionalSpecsValue.getValue());
			}
			double suggestedPrice = suggestPrice(theta, x);
			Integer price = equipment.getDailyPrice();
//			sum += suggestedPrice / price;
			residualSum += Math.pow(suggestedPrice - price,2);
			totalSumOfSquare += Math.pow(price - y_mean, 2);

		}


		return 1 - (residualSum / totalSumOfSquare);

	}

	public double suggestPrice(INDArray theta, double[] inputX) {
		INDArray bias = Nd4j.ones(1, 1);
		INDArray x = Nd4j.hstack(bias, Nd4j.create(inputX));
		INDArray mmul = x.mmul(theta);

		// TODO: 4/22/19 remove exception here
		if (mmul.shape()[0] != 1 || mmul.shape()[1] != 1) {
			throw new InternalServerErrorException("Result shape is not [1,1]");
		}

		return mmul.getDouble(0, 0);
	}

	public void trainModel() {
		List<EquipmentTypeEntity> equipmentTypeEntities = equipmentTypeDAO.findAll(false);
		for (EquipmentTypeEntity equipmentTypeEntity : equipmentTypeEntities) {

			INDArray theta = null;
			try {
				theta = calculateTheta(equipmentTypeEntity.getId());
			} catch (Exception e) {
				e.printStackTrace();
			}
			if (theta == null) {
				continue;

			}

		}
	}
}
