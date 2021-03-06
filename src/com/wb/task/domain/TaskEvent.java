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

import com.google.gson.annotations.Expose;

/**
 * TaskEvent entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "task_event", catalog = "super_oa")
public class TaskEvent implements java.io.Serializable {

	// Fields
	private Integer id;
	private TaskInfo taskInfo;
	private String content;
	private String operateUser;
	private String time;
	private Integer type;

	// Constructors

	/** default constructor */
	public TaskEvent() {
	}

	/** full constructor */
	public TaskEvent(TaskInfo taskInfo, String title, String content,
			String operateUser, String time, Integer type) {
		this.taskInfo = taskInfo;
		this.content = content;
		this.operateUser = operateUser;
		this.time = time;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "task_Id")
	public TaskInfo getTaskInfo() {
		return this.taskInfo;
	}

	public void setTaskInfo(TaskInfo taskInfo) {
		this.taskInfo = taskInfo;
	}

	@Column(name = "content", length = 500)
	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "operate_user", length = 20)
	public String getOperateUser() {
		return this.operateUser;
	}

	public void setOperateUser(String operateUser) {
		this.operateUser = operateUser;
	}

	@Column(name = "time", length = 20)
	public String getTime() {
		return this.time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	@Column(name = "type")
	public Integer getType() {
		return this.type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

}