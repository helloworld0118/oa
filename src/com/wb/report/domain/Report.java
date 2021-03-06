package com.wb.report.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

/**
 * Report entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "report", catalog = "super_oa")
public class Report implements java.io.Serializable {

	// Fields

	private Integer id;
	private String title;
	private String type;
	private String time;
	private String beginTime;
	private String endTime;
	private String content;
	private String reportUser;
	private String examineUser;

	// Constructors

	/** default constructor */
	public Report() {
	}

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

	@Column(name = "title", length = 50)
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "type", length = 20)
	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Column(name = "time", length = 20)
	public String getTime() {
		return this.time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	@Column(name = "begin_time", length = 20)
	public String getBeginTime() {
		return this.beginTime;
	}

	public void setBeginTime(String beginTime) {
		this.beginTime = beginTime;
	}

	@Column(name = "end_time", length = 20)
	public String getEndTime() {
		return this.endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	@Column(name = "content", length = 2000)
	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "report_user", length = 50)
	public String getReportUser() {
		return this.reportUser;
	}

	public void setReportUser(String reportUser) {
		this.reportUser = reportUser;
	}

	@Column(name = "examine_user", length = 50)
	public String getExamineUser() {
		return this.examineUser;
	}

	public void setExamineUser(String examineUser) {
		this.examineUser = examineUser;
	}

}