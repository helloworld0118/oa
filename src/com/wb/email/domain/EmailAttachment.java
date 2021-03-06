package com.wb.email.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

import com.mysql.jdbc.Blob;

/**
 * EmailAttachment entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "email_attachment", catalog = "super_oa")
public class EmailAttachment implements java.io.Serializable {

	// Fields

	private Integer id;
	private EmailBox emailBox;
	private String atUrl;

	// Constructors

	/** default constructor */
	public EmailAttachment() {
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
	@JoinColumn(name = "email_box")
	public EmailBox getEmailBox() {
		return this.emailBox;
	}

	public void setEmailBox(EmailBox emailBox) {
		this.emailBox = emailBox;
	}

	@Column(name = "at_url")
	public String getAtUrl() {
		return atUrl;
	}


	public void setAtUrl(String atUrl) {
		this.atUrl = atUrl;
	}



}