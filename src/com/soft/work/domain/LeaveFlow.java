package com.soft.work.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

import com.soft.core.domain.ActivitiBaseEntity;
import com.wb.core.domain.UserInfo;

/**
 * LeaveFlow entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "leave_flow", catalog = "super_oa")
public class LeaveFlow extends ActivitiBaseEntity {

	// Fields

	private String beginTime;
	private String endTime;
	private boolean isAllDay;

	// Constructors
    @Column(name="isAllDay")
	public boolean isAllDay() {
		return isAllDay;
	}

	public void setAllDay(boolean isAllDay) {
		this.isAllDay = isAllDay;
	}

	// Constructors

	/** default constructor */
	public LeaveFlow() {
	}

	/** full constructor */
	public LeaveFlow(UserInfo userInfo, String beginTime, String endTime,
			String applyReson, Integer state, String title, String time,
			String reason) {
		this.beginTime = beginTime;
		this.endTime = endTime;
	}

	// Property accessors

	@Column(name = "begin_time", length = 50)
	public String getBeginTime() {
		return this.beginTime;
	}

	public void setBeginTime(String beginTime) {
		this.beginTime = beginTime;
	}

	@Column(name = "end_time", length = 50)
	public String getEndTime() {
		return this.endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	

}