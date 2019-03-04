package test.shit;


import dtos.requests.EquipmentRequest;
import entities.EquipmentEntity;
import org.modelmapper.ModelMapper;
import utils.ModelConverter;

import javax.inject.Inject;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;

@Path("cdiTest")
@Produces({MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN})
public class TestResource extends HttpServlet {


	@Inject
	 Message messageB;

	@Inject
	 TestDAO testDAO;

	@Inject
	ModelConverter modelConverter;
	@GET
	public String doGet() {
		return messageB.get();
	}

	@GET
	@Path("dao")
	public Response testDao() {

		return Response.ok(testDAO.testGetFeedbackEntityId(3)).build();
	}

	@GET

	@Path("null")
	public Response testNull() {
		System.out.println("null here ");
		return Response.ok(null).build();
	}

	@POST
	@Path("equipment")
	public Response testPostEquipment(@Valid EquipmentRequest equipmentRequest) {
		EquipmentEntity equipmentEntity = modelConverter.toEntity(equipmentRequest);
		EquipmentRequest equipmentRequest1 = modelConverter.toRequest(equipmentEntity);
		return Response.ok(equipmentRequest1).build();
	}
//	@Override
//	public void init() {
//		messageB = new MessageB();
//	}

}