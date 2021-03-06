package com.wb.email.domain;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

import com.wb.core.domain.UserInfo;

/**
 * EmailBox entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "email_box", catalog = "super_oa")
public class EmailBox implements java.io.Serializable {

	// Fields

	private Integer emailId;
	private String emailTitle;
	private String emailContent;
	private String emailDate;
	private Set<EmailAttachment> emailAttachments = new HashSet<EmailAttachment>(
			0);
	private UserInfo sendUser;
	private Boolean isDelete;
	private Integer judge;
	private Set<EmailRelationAccept> emailRelationAccepts = new HashSet<EmailRelationAccept>(0);

	// Constructors

	/** default constructor */
	public EmailBox() {
	}


	// Property accessors
	@GenericGenerator(name = "generator", strategy = "increment")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "email_id", unique = true, nullable = false)
	public Integer getEmailId() {
		return this.emailId;
	}

	public void setEmailId(Integer emailId) {
		this.emailId = emailId;
	}

	@Column(name = "email_title", length = 50)
	public String getEmailTitle() {
		return this.emailTitle;
	}

	public void setEmailTitle(String emailTitle) {
		this.emailTitle = emailTitle;
	}

	@Column(name = "email_content", length = 2000)
	public String getEmailContent() {
		return this.emailContent;
	}

	public void setEmailContent(String emailContent) {
		this.emailContent = emailContent;
	}

	@Column(name = "email_date", length = 20)
	public String getEmailDate() {
		return this.emailDate;
	}

	public void setEmailDate(String emailDate) {
		this.emailDate = emailDate;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "emailBox")
	public Set<EmailAttachment> getEmailAttachments() {
		return this.emailAttachments;
	}

	public void setEmailAttachments(Set<EmailAttachment> emailAttachments) {
		this.emailAttachments = emailAttachments;
	}
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "emailBox")
	public Set<EmailRelationAccept> getEmailRelationAccepts() {
		return emailRelationAccepts;
	}


	public void setEmailRelationAccepts(
			Set<EmailRelationAccept> emailRelationAccepts) {
		this.emailRelationAccepts = emailRelationAccepts;
	}

    @JoinColumn(name="sendUser")
    @OneToOne
	public UserInfo getSendUser() {
		return sendUser;
	}


	public void setSendUser(UserInfo sendUser) {
		this.sendUser = sendUser;
	}


	public Boolean getIsDelete() {
		return isDelete;
	}


	public void setIsDelete(Boolean isDelete) {
		this.isDelete = isDelete;
	}


	public Integer getJudge() {
		return judge;
	}


	public void setJudge(Integer judge) {
		this.judge = judge;
	}

}