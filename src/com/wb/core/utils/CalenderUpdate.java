package com.wb.core.utils;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

/**
 * Calender entity. @author MyEclipse Persistence Tools
 */
public class CalenderUpdate implements java.io.Serializable {

	// Fields

	private String EventId;
	private String CalendarId;
	private String EndDate;
	private Boolean IsAllDay;
	private Boolean IsNew;
	private Boolean IsReminder;
	private String Location;
	private String Notes;
	private String Reminder;
	private String StartDate;
	private String Title;
	private String Url;

	// Constructors

	/** default constructor */
	public CalenderUpdate() {
	}

	/** full constructor */
	public CalenderUpdate(String calendarId, String endDate, Boolean isAllDay,
			Boolean isNew, Boolean isReminder, String location, String notes,
			String reminder, String startDate, String title, String url) {
	}

	public String getEventId() {
		return this.EventId;
	}

	public void setEventId(String eventId) {
		this.EventId = eventId;
	}

	public String getCalendarId() {
		return this.CalendarId;
	}

	public void setCalendarId(String calendarId) {
		this.CalendarId = calendarId;
	}

	public String getEndDate() {
		return this.EndDate;
	}

	public void setEndDate(String endDate) {
		this.EndDate = endDate;
	}

	public Boolean getIsAllDay() {
		return this.IsAllDay;
	}

	public void setIsAllDay(Boolean isAllDay) {
		this.IsAllDay = isAllDay;
	}

	public Boolean getIsNew() {
		return this.IsNew;
	}

	public void setIsNew(Boolean isNew) {
		this.IsNew = isNew;
	}
	public Boolean getIsReminder() {
		return this.IsReminder;
	}

	public void setIsReminder(Boolean isReminder) {
		this.IsReminder = isReminder;
	}

	public String getLocation() {
		return this.Location;
	}

	public void setLocation(String location) {
		this.Location = location;
	}

	public String getNotes() {
		return this.Notes;
	}

	public void setNotes(String notes) {
		this.Notes = notes;
	}

	public String getReminder() {
		return this.Reminder;
	}

	public void setReminder(String reminder) {
		this.Reminder = reminder;
	}

	public String getStartDate() {
		return this.StartDate;
	}

	public void setStartDate(String startDate) {
		this.StartDate = startDate;
	}

	public String getTitle() {
		return this.Title;
	}

	public void setTitle(String title) {
		this.Title = title;
	}

	public String getUrl() {
		return this.Url;
	}

	public void setUrl(String url) {
		this.Url = url;
	}

}