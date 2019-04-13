package dtos.wrappers;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class LocalDateWrapper {
	private LocalDate localDate;

	public LocalDate getLocalDate() {
		return localDate;
	}

	public void setLocalDate(LocalDate localDate) {
		this.localDate = localDate;
	}

	public LocalDateWrapper(LocalDate localDate) {
		this.localDate = localDate;
	}

	public LocalDateWrapper() {
	}

	public static LocalDateWrapper valueOf(String valueStr) {

		LocalDate localDate = null;
		try {
			localDate = LocalDate.parse(valueStr, DateTimeFormatter.ISO_DATE);
		} catch (DateTimeParseException e) {
			e.printStackTrace();
		}
		return new LocalDateWrapper(localDate);



	}
}

