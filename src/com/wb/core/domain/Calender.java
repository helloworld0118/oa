package com.wb.core.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

import com.google.gson.annotations.Expose;

/**
 * Calender entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "calender", catalog = "super_oa")
public class Calender implements java.io.Serializable {

	// Fields
	@Expose
	private Integer EventId;
	@Expose
	private String CalendarId;
	@Expose
	private String EndDate;
	@Expose
	private Boolean IsAllDay;
	@Expose
	private Boolean IsNew;
	@Expose
	private Boolean IsReminder;
	@Expose
	private String Location;
	@Expose
	private String Notes;
	@Expose
	private String Reminder;
	@Expose
	private String StartDate;
	@Expose
	private String Title;
	@Expose
	private String Url;
	private int userId;

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	/** default constructor */
	public Calender() {
	}

	/** full constructor */
	public Calender(String calendarId, String endDate, Boolean isAllDay,
			Boolean isNew, Boolean isReminder, String location, String notes,
			String reminder, String startDate, String title, String url) {
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "increment")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "eventId", unique = true, nullable = false)
	public Integer getEventId() {
		return this.EventId;
	}

	public void setEventId(Integer eventId) {
		this.EventId = eventId;
	}

	@Column(name = "calendarId")
	public String getCalendarId() {
		return this.CalendarId;
	}

	public void setCalendarId(String calendarId) {
		this.CalendarId = calendarId;
	}

	@Column(name = "endDate")
	public String getEndDate() {
		return this.EndDate;
	}

	public void setEndDate(String endDate) {
		this.EndDate = endDate;
	}

	@Column(name = "isAllDay")
	public Boolean getIsAllDay() {
		return this.IsAllDay;
	}

	public void setIsAllDay(Boolean isAllDay) {
		this.IsAllDay = isAllDay;
	}

	@Column(name = "isNew")
	public Boolean getIsNew() {
		return this.IsNew;
	}

	public void setIsNew(Boolean isNew) {
		this.IsNew = isNew;
	}

	@Column(name = "isReminder")
	public Boolean getIsReminder() {
		return this.IsReminder;
	}

	public void setIsReminder(Boolean isReminder) {
		this.IsReminder = isReminder;
	}

	@Column(name = "location")
	public String getLocation() {
		return this.Location;
	}

	public void setLocation(String location) {
		this.Location = location;
	}

	@Column(name = "notes")
	public String getNotes() {
		return this.Notes;
	}

	public void setNotes(String notes) {
		this.Notes = notes;
	}

	@Column(name = "reminder")
	public String getReminder() {
		return this.Reminder;
	}

	public void setReminder(String reminder) {
		this.Reminder = reminder;
	}

	@Column(name = "startDate")
	public String getStartDate() {
		return this.StartDate;
	}

	public void setStartDate(String startDate) {
		this.StartDate = startDate;
	}

	@Column(name = "title")
	public String getTitle() {
		return this.Title;
	}

	public void setTitle(String title) {
		this.Title = title;
	}

	@Column(name = "url")
	public String getUrl() {
		return this.Url;
	}

	public void setUrl(String url) {
		this.Url = url;
	}

}