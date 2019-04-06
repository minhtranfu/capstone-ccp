package dtos.wrappers;

public class OrderByWrapper {
	private String columnName;
	private boolean isAscending;

	public OrderByWrapper() {
	}

	public OrderByWrapper(String columnName, boolean isAscending) {
		this.columnName = columnName;
		this.isAscending = isAscending;
	}

	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	public boolean isAscending() {
		return isAscending;
	}

	public void setAscending(boolean ascending) {
		isAscending = ascending;
	}
}
