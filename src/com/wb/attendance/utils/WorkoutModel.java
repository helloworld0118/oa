package com.wb.attendance.utils;
public class WorkoutModel implements java.io.Serializable {
	private static final long serialVersionUID = 1L;
	private Integer id;
	private String userInfoByApplyUser;
	private String userInfoByExamineUser;
	private String startDate;
	private String endDate;
	private String outAddress;
	private String reason;
	private String reallyEndDate;
	private String applyDate;
    private String state;
	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public String getOutAddress() {
		return outAddress;
	}

	public void setOutAddress(String outAddress) {
		this.outAddress = outAddress;
	}

	private String isAllDay;
	// Constructors

	/** default constructor */
	public WorkoutModel() {
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