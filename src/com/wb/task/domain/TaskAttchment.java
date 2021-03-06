package com.wb.task.domain;

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
 * TaskAttchment entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "task_attchment", catalog = "super_oa")
public class TaskAttchment implements java.io.Serializable {

	// Fields

	private Integer id;
	private TaskInfo taskInfo;
	private String url;

	// Constructors

	/** default constructor */
	public TaskAttchment() {
	}

	/** full constructor */
	public TaskAttchment(TaskInfo taskInfo, String url) {
		this.taskInfo = taskInfo;
		this.url = url;
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
	@JoinColumn(name = "task_Id")
	public TaskInfo getTaskInfo() {
		return this.taskInfo;
	}

	public void setTaskInfo(TaskInfo taskInfo) {
		this.taskInfo = taskInfo;
	}

	@Column(name = "url", length = 200)
	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

}