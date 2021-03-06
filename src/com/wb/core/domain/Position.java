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
@Table(name = "position", catalog = "super_oa")
public class Position implements java.io.Serializable {

	// Fields
	private Integer id;
	private String positionName;
	private String positionDes;

	// Constructors

	/** default constructor */
	public Position() {
	}

	/** full constructor */

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
	@Column(name = "position_name", length = 20)
	public String getPositionName() {
		return positionName;
	}

	public void setPositionName(String positionName) {
		this.positionName = positionName;
	}
	@Column(name = "position_des", length = 200)
	public String getPositionDes() {
		return positionDes;
	}

	public void setPositionDes(String positionDes) {
		this.positionDes = positionDes;
	}

	

	


}