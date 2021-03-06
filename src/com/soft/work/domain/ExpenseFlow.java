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
 * ExpenseFlow entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "expense_flow", catalog = "super_oa")
public class ExpenseFlow extends ActivitiBaseEntity {

	// Fields

	private Float expenseMoney;
	// Constructors

	/** default constructor */
	public ExpenseFlow() {
	}

	/** full constructor */
	public ExpenseFlow(UserInfo userInfo, String reason, Integer state,
			Float expenseMoney, String title, String time) {
		this.expenseMoney = expenseMoney;
	}


	@Column(name = "expense_money", precision = 12, scale = 0)
	public Float getExpenseMoney() {
		return this.expenseMoney;
	}

	public void setExpenseMoney(Float expenseMoney) {
		this.expenseMoney = expenseMoney;
	}

}