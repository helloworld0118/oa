package com.wb.attendance.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

import com.wb.core.domain.UserInfo;

/**
 * OutApply entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "out_apply", catalog = "super_oa")
public class OutApply implements java.io.Serializable {

	// Fields

	private Integer id;
	private UserInfo userInfoByApplyUser;
	private UserInfo userInfoByExamineUser;
	private String startDate;
	private String endDate;
	private String reallyEndDate;
	private String reason;
	private String applyDate;
    private String state;
	// Constructors

	/** default constructor */
	public OutApply() {
	}

	/** full constructor */
	public OutApply(UserInfo userInfoByApplyUser,
			UserInfo userInfoByExamineUser, 
			String startDate, String endDate, String reason, String applyDate) {
		this.userInfoByApplyUser = userInfoByApplyUser;
		this.userInfoByExamineUser = userInfoByExamineUser;
		this.startDate = startDate;
		this.endDate = endDate;
		this.reason = reason;
		this.applyDate = applyDate;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "increment")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "id", unique = true, nullable = false)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "apply_user")
	public UserInfo getUserInfoByApplyUser() {
		return this.userInfoByApplyUser;
	}

	public void setUserInfoByApplyUser(UserInfo userInfoByApplyUser) {
		this.userInfoByApplyUser = userInfoByApplyUser;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "examine_user")
	public UserInfo getUserInfoByExamineUser() {
		return this.userInfoByExamineUser;
	}

	public void setUserInfoByExamineUser(UserInfo userInfoByExamineUser) {
		this.userInfoByExamineUser = userInfoByExamineUser;
	}

	@Column(name = "start_date", length = 20)
	public String getStartDate() {
		return this.startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	@Column(name = "end_date", length = 20)
	public String getEndDate() {
		return this.endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	@Column(name = "reason", length = 200)
	public String getReason() {
		return this.reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	@Column(name = "apply_date", length = 50)
	public String getApplyDate() {
		return this.applyDate;
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