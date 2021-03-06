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

import com.google.gson.annotations.Expose;

/**
 * Depart entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "depart", catalog = "super_oa")
public class Depart implements java.io.Serializable {

	// Fields
	@Expose
	private Integer id;
	@Expose
	private String departName;
	@Expose
	private String departDes;

	// Constructors

	/** default constructor */
	public Depart() {
	}

	/** full constructor */
	public Depart(String departName, String departDes, String departTel,
			Set<UserInfo> userInfos) {
		this.departName = departName;
		this.departDes = departDes;
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

	@Column(name = "depart_name", length = 20)
	public String getDepartName() {
		return this.departName;
	}

	public void setDepartName(String departName) {
		this.departName = departName;
	}

	@Column(name = "depart_des", length = 200)
	public String getDepartDes() {
		return this.departDes;
	}

	public void setDepartDes(String departDes) {
		this.departDes = departDes;
	}


}