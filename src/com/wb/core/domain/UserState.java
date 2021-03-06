package com.wb.core.domain;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

/**
 * UserState entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "user_state", catalog = "super_oa")
public class UserState implements java.io.Serializable {

	// Fields

	private Integer id;
	private String stateType;

	// Constructors

	/** default constructor */
	public UserState() {
	}

	/** full constructor */
	public UserState(String stateType, Set<UserInfo> userInfos) {
		this.stateType = stateType;
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

	@Column(name = "state_type", length = 20)
	public String getStateType() {
		return this.stateType;
	}

	public void setStateType(String stateType) {
		this.stateType = stateType;
	}

}