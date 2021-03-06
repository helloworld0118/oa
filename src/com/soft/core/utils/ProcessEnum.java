package com.soft.core.utils;

public enum ProcessEnum {
	
	leave("请假流程"), expense("报销流程");
	
	private ProcessEnum(String value) {
		this.value = value;
	}
	
	private String value;
	
	public String getValue() {
		return value;
	}
	
}
