package com.wb.notice.domain;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

/**
 * NoticeInfo entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "notice_info", catalog = "super_oa")
public class NoticeInfo implements java.io.Serializable {

	// Fields

	private Integer id;
	private String user;
	private String title;
	private String detail;
	private String arrangTime;
	private String beginTime;
	private String endTime;
	private Boolean isAllDay;
	private String color;
	private Set<NoticeSeen> noticeSeens = new HashSet<NoticeSeen>(0);

	// Constructors

	/** default constructor */
	public NoticeInfo() {
	}

	/** full constructor */
	public NoticeInfo(String user, String title, String detail,
			String arrangTime, String beginTime, String endTime,
			Boolean isAllDay, String color, Set<NoticeSeen> noticeSeens) {
		this.user = user;
		this.title = title;
		this.detail = detail;
		this.arrangTime = arrangTime;
		this.beginTime = beginTime;
		this.endTime = endTime;
		this.isAllDay = isAllDay;
		this.color = color;
		this.noticeSeens = noticeSeens;
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

	@Column(name = "user", length = 50)
	public String getUser() {
		return this.user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	@Column(name = "title", length = 200)
	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "detail", length = 2000)
	public String getDetail() {
		return this.detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

	@Column(name = "arrangTime", length = 20)
	public String getArrangTime() {
		return this.arrangTime;
	}

	public void setArrangTime(String arrangTime) {
		this.arrangTime = arrangTime;
	}

	@Column(name = "beginTime", length = 20)
	public String getBeginTime() {
		return this.beginTime;
	}

	public void setBeginTime(String beginTime) {
		this.beginTime = beginTime;
	}

	@Column(name = "endTime", length = 20)
	public String getEndTime() {
		return this.endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	@Column(name = "isAllDay")
	public Boolean getIsAllDay() {
		return this.isAllDay;
	}

	public void setIsAllDay(Boolean isAllDay) {
		this.isAllDay = isAllDay;
	}

	@Column(name = "color", length = 20)
	public String getColor() {
		return this.color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "noticeInfo")
	public Set<NoticeSeen> getNoticeSeens() {
		return this.noticeSeens;
	}

	public void setNoticeSeens(Set<NoticeSeen> noticeSeens) {
		this.noticeSeens = noticeSeens;
	}

}