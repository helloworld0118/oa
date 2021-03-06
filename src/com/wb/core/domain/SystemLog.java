package com.wb.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

/**
 * SystemLog entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "system_log", catalog = "super_oa")
public class SystemLog implements java.io.Serializable {

	// Fields

	private Integer id;
	private Integer logTypeId;
	private Integer userId;
	private String userName;
	private String logDate;
	private String logSource;
	private String logContent;

	// Constructors

	/** default constructor */
	public SystemLog() {
	}

	/** full constructor */
	public SystemLog(Integer logTypeId, Integer userId, String userName,
			String logDate, String logSource, String logContent) {
		this.logTypeId = logTypeId;
		this.userId = userId;
		this.userName = userName;
		this.logDate = logDate;
		this.logSource = logSource;
		this.logContent = logContent;
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

	@Column(name = "log_type_id")
	public Integer getLogTypeId() {
		return this.logTypeId;
	}

	public void setLogTypeId(Integer logTypeId) {
		this.logTypeId = logTypeId;
	}

	@Column(name = "user_id")
	public Integer getUserId() {
		return this.userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	@Column(name = "user_name", length = 20)
	public String getUserName() {
		return this.userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	@Column(name = "log_date", length = 20)
	public String getLogDate() {
		return this.logDate;
	}

	public void setLogDate(String logDate) {
		this.logDate = logDate;
	}

	@Column(name = "log_source", length = 50)
	public String getLogSource() {
		return this.logSource;
	}

	public void setLogSource(String logSource) {
		this.logSource = logSource;
	}

	@Column(name = "log_content", length = 200)
	public String getLogContent() {
		return this.logContent;
	}

	public void setLogContent(String logContent) {
		this.logContent = logContent;
	}

}