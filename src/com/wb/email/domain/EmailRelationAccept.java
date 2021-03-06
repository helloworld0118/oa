package com.wb.email.domain;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

import com.wb.core.domain.UserInfo;

/**
 * EmailRelation entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "email_relation_accept", catalog = "super_oa")
public class EmailRelationAccept implements java.io.Serializable {

	// Fields

	private Integer id;
	private UserInfo userInfo;
	private EmailBox emailBox;
	private Boolean isDelete;
	private Integer judge;
    private Boolean isRead;
	// Constructors

	/** default constructor */
	public EmailRelationAccept() {
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
	@JoinColumn(name = "email")
	public EmailBox getEmailBox() {
		return this.emailBox;
	}

	public void setEmailBox(EmailBox emailBox) {
		this.emailBox = emailBox;
	}


	@Column(name = "Judge")
	public Integer getJudge() {
		return this.judge;
	}

	public void setJudge(Integer judge) {
		this.judge = judge;
	}
	@ManyToOne(fetch = FetchType.EAGER)
	public UserInfo getUserInfo() {
		return userInfo;
	}

	public void setUserInfo(UserInfo userInfo) {
		this.userInfo = userInfo;
	}


	public Boolean getIsRead() {
		return isRead;
	}

	public void setIsRead(Boolean isRead) {
		this.isRead = isRead;
	}

	public Boolean getIsDelete() {
		return isDelete;
	}

	public void setIsDelete(Boolean isDelete) {
		this.isDelete = isDelete;
	}

}