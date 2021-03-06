package com.wb.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

/**
 * RoleAndRight entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "role_and_right", catalog = "super_oa")
public class RoleAndRight implements java.io.Serializable {

	// Fields

	private Integer id;
	private RoleInfo roleInfo;
	private RoleRight roleRight;

	// Constructors

	/** default constructor */
	public RoleAndRight() {
	}

	/** full constructor */
	public RoleAndRight(RoleInfo roleInfo, RoleRight roleRight) {
		this.roleInfo = roleInfo;
		this.roleRight = roleRight;
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
	@JoinColumn(name = "role_info_id")
	public RoleInfo getRoleInfo() {
		return this.roleInfo;
	}

	public void setRoleInfo(RoleInfo roleInfo) {
		this.roleInfo = roleInfo;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "role_right_id")
	public RoleRight getRoleRight() {
		return this.roleRight;
	}

	public void setRoleRight(RoleRight roleRight) {
		this.roleRight = roleRight;
	}

}