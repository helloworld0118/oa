package com.wb.core.domain;

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
 * Desktop entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "desktop", catalog = "super_oa")
public class Desktop implements java.io.Serializable {

	// Fields

	private Integer id;
	private UserInfo userInfo;
	private String desktop;
	private boolean stretch;

	// Constructors

	/** default constructor */
	public Desktop() {
	}

	/** full constructor */
	public Desktop(UserInfo userInfo, String desktop, Boolean stretch) {
		this.userInfo = userInfo;
		this.desktop = desktop;
		this.stretch = stretch;
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
	@JoinColumn(name = "user_id")
	public UserInfo getUserInfo() {
		return this.userInfo;
	}

	public void setUserInfo(UserInfo userInfo) {
		this.userInfo = userInfo;
	}

	@Column(name = "desktop", length = 100)
	public String getDesktop() {
		return this.desktop;
	}

	public void setDesktop(String desktop) {
		this.desktop = desktop;
	}

	@Column(name = "stretch")
	public boolean getStretch() {
		return this.stretch;
	}

	public void setStretch(boolean stretch) {
		this.stretch = stretch;
	}

}