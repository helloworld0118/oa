package com.wb.attendance.utils;
public class WorkExtraModel implements java.io.Serializable {

	// Fields

	private Integer id;
	private String userInfoByApplyUser;
	private String userInfoByExamineUser;
	private String startDate;
	private String estimateEndDate;
	private String reallyEndDate;
	private String reason;
	private String applyDate;
	private String state;
	private String isAllDay;
	// Constructors

	/** default constructor */
	public WorkExtraModel() {
	}

	public String getIsAllDay() {
		return isAllDay;
	}

	public void setIsAllDay(String isAllDay) {
		this.isAllDay = isAllDay;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUserInfoByApplyUser() {
		return userInfoByApplyUser;
	}

	public void setUserInfoByApplyUser(String userInfoByApplyUser) {
		this.userInfoByApplyUser = userInfoByApplyUser;
	}

	public String getUserInfoByExamineUser() {
		return userInfoByExamineUser;
	}

	public void setUserInfoByExamineUser(String userInfoByExamineUser) {
		this.userInfoByExamineUser = userInfoByExamineUser;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEstimateEndDate() {
		return estimateEndDate;
	}

	public void setEstimateEndDate(String estimateEndDate) {
		this.estimateEndDate = estimateEndDate;
	}

	public String getReallyEndDate() {
		return reallyEndDate;
	}

	public void setReallyEndDate(String reallyEndDate) {
		this.reallyEndDate = reallyEndDate;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getApplyDate() {
		return applyDate;
	}

	public void setApplyDate(String applyDate) {
		this.applyDate = applyDate;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

}