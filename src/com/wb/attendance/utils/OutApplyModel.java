package com.wb.attendance.utils;


/**
 * WorkExtra entity. @author MyEclipse Persistence Tools
 */
public class OutApplyModel implements java.io.Serializable {

	private Integer id;
	private String userInfoByApplyUser;
	private String userInfoByExamineUser;
	private String startDate;
	private String endDate;
	private String reason;
	private String reallyEndDate;
	
	private String applyDate;
    private String state;
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
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
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
	public String getReallyEndDate() {
		return reallyEndDate;
	}
	public void setReallyEndDate(String reallyEndDate) {
		this.reallyEndDate = reallyEndDate;
	}
}