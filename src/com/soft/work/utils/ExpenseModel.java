package com.soft.work.utils;

public class ExpenseModel {
	private String id;
	private String userName;
	private String title;
	private String state;
	private float expenseMoney;
	private String applyDate;

	public float getExpenseMoney() {
		return expenseMoney;
	}

	public void setExpenseMoney(float expenseMoney) {
		this.expenseMoney = expenseMoney;
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

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	private String reason;
}
