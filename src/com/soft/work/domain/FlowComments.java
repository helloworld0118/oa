package com.soft.work.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

/**
 * FlowComments entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "flow_comments", catalog = "super_oa")
public class FlowComments implements java.io.Serializable {

	// Fields

	private Integer id;
	private String msg;
	private String userName;
    private Integer flowType;


	private Integer flowId;
    
	// Constructors

	/** default constructor */
	public FlowComments() {
	}

	/** full constructor */
	public FlowComments(String msg, Integer flowId) {
		this.msg = msg;
		this.flowId = flowId;
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

	@Column(name = "msg", length = 1000)
	public String getMsg() {
		return this.msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	@Column(name = "flow_id")
	public Integer getFlowId() {
		return this.flowId;
	}

	public void setFlowId(Integer flowId) {
		this.flowId = flowId;
	}
	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}
	@Column(name = "flow_type")
	public Integer getFlowType() {
		return flowType;
	}

	public void setFlowType(Integer flowType) {
		this.flowType = flowType;
	}
}