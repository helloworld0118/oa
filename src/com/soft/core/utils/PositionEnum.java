package com.soft.core.utils;

public enum PositionEnum {

	departManager("主管");
	private PositionEnum(String value) {
		this.value = value;
	}
	
	private String value;

	public String getValue() {
		return value;
	}
	
}
