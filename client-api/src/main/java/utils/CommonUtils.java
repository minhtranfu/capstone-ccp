package utils;

import dtos.responses.MessageResponse;
import dtos.wrappers.OrderByWrapper;
import entities.EquipmentEntity;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Root;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CommonUtils {
	public static Response responseFilterOk(Object data) {
		return addFilterHeader(Response.ok(data)).build();
	}

	public static Response.ResponseBuilder addFilterHeader(Response.ResponseBuilder responseBuilder) {
		return responseBuilder.header(
				"Access-Control-Allow-Origin", "*")
				.header(
						"Access-Control-Allow-Credentials", "true")
				.header(
						"Access-Control-Allow-Headers",
						"origin, content-type, accept, authorization")
				.header(
						"Access-Control-Allow-Methods",
						"GET, POST, PUT, DELETE, OPTIONS, HEAD");
	}

	public static Response responseFilterBadRequest(Object data) {
		return addFilterHeader(Response.status(Response.Status.BAD_REQUEST)).entity(data).build();
	}


	public static Response responseError(Response.Status status, String message) {
		return Response.status(status).entity(new MessageResponse(message)).build();
	}

	public static List<OrderByWrapper> getOrderList(String orderBy) {
		ArrayList<OrderByWrapper> orderByWrappers = new ArrayList<>();

		Pattern pattern = Pattern.compile(Constants.RESOURCE_REGEX_ORDERBY_SINGLEITEM);

		Matcher matcher = pattern.matcher(orderBy);
		while (matcher.find()) {
			String orderBySingleItem = orderBy.substring(matcher.start(), matcher.end());


			String columnName = matcher.group(1);
			String orderKeyword = matcher.group(2);


			if (orderKeyword.equals("desc")) {
				orderByWrappers.add(new OrderByWrapper(columnName, false));
			} else {
				orderByWrappers.add(new OrderByWrapper(columnName, true));
			}
		}

		return orderByWrappers;
	}



}
