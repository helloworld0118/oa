package com.wb.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

/**
 * LogType entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "log_type", catalog = "super_oa")
public class LogType implements java.io.Serializable {

	// Fields

	private Integer id;
	private String type;

	// Constructors

	/** default constructor */
	public LogType() {
	}

	/** full constructor */
	public LogType(String type) {
		this.type = type;
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

	@Column(name = "type", length = 20)
	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

}