package com.wb.attendance.utils;

public class WorkCensusModel {
	private int id;  
	private String userName;
	private String departName;
	private int workoutCount=0;
	private int outCount=0;
	private String workExtraCount="0";
    private int leaveCount=0;
	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getDepartName() {
		return departName;
	}

	public void setDepartName(String departName) {
		this.departName = departName;
	}


	public int getOutCount() {
		return outCount;
	}

	public void setOutCount(int outCount) {
		this.outCount = outCount;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getLeaveCount() {
		return leaveCount;
	}

	public void setLeaveCount(int leaveCount) {
		this.leaveCount = leaveCount;
	}

	public int getWorkoutCount() {
		return workoutCount;
	}

	public void setWorkoutCount(int workoutCount) {
		this.workoutCount = workoutCount;
	}

	public String getWorkExtraCount() {
		return workExtraCount;
	}

	public void setWorkExtraCount(String workExtraCount) {
		this.workExtraCount = workExtraCount;
	}

}