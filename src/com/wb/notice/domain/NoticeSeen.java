package com.wb.notice.domain;

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
 * NoticeSeen entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "notice_seen", catalog = "super_oa")
public class NoticeSeen implements java.io.Serializable {

	// Fields

	private Integer id;
	private NoticeInfo noticeInfo;
	private Integer user;
	 private String time;
	// Constructors

	/** default constructor */
	public NoticeSeen() {
	}

	/** full constructor */
	public NoticeSeen(NoticeInfo noticeInfo, Integer user) {
		this.noticeInfo = noticeInfo;
		this.user = user;
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
	@JoinColumn(name = "notice")
	public NoticeInfo getNoticeInfo() {
		return this.noticeInfo;
	}

	public void setNoticeInfo(NoticeInfo noticeInfo) {
		this.noticeInfo = noticeInfo;
	}

	@Column(name = "user")
	public Integer getUser() {
		return this.user;
	}

	public void setUser(Integer user) {
		this.user = user;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

}