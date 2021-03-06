package com.wb.task.domain;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

import com.wb.core.domain.UserInfo;

/**
 * TaskInfo entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "task_info", catalog = "super_oa")
public class TaskInfo implements java.io.Serializable {

	// Fields

	private Integer id;
	private UserInfo userInfoByArrangeUser;
	private UserInfo userInfoByResponsibleUser;
	private UserInfo userInfoByExamineUser;
	private String title;
	private Integer predictHours;
	private String arrangeTime;
	private String beginTime;
	private String overTime;
	private String startTime;
	private String endTime;
	private Boolean isExamine;
	private String content;
	private String rewardOrpenaltie;
	private String leadAdvice;
	private Integer state;
	private Integer score;
	private Integer rate;
	private Boolean isUrge;
	private Boolean isAllDay;
	private String urgeContent;
	private String partakeUsers;

	// Constructors

	/** default constructor */
	public TaskInfo() {
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
	@JoinColumn(name = "arrange_user")
	public UserInfo getUserInfoByArrangeUser() {
		return this.userInfoByArrangeUser;
	}

	public void setUserInfoByArrangeUser(UserInfo userInfoByArrangeUser) {
		this.userInfoByArrangeUser = userInfoByArrangeUser;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "responsible_user")
	public UserInfo getUserInfoByResponsibleUser() {
		return this.userInfoByResponsibleUser;
	}

	public void setUserInfoByResponsibleUser(UserInfo userInfoByResponsibleUser) {
		this.userInfoByResponsibleUser = userInfoByResponsibleUser;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "examine_user")
	public UserInfo getUserInfoByExamineUser() {
		return this.userInfoByExamineUser;
	}

	public void setUserInfoByExamineUser(UserInfo userInfoByExamineUser) {
		this.userInfoByExamineUser = userInfoByExamineUser;
	}

	@Column(name = "title", length = 50)
	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "predict_hours")
	public Integer getPredictHours() {
		return this.predictHours;
	}

	public void setPredictHours(Integer predictHours) {
		this.predictHours = predictHours;
	}

	@Column(name = "arrange_time", length = 20)
	public String getArrangeTime() {
		return this.arrangeTime;
	}

	public void setArrangeTime(String arrangeTime) {
		this.arrangeTime = arrangeTime;
	}

	@Column(name = "over_time", length = 20)
	public String getOverTime() {
		return this.overTime;
	}

	public void setOverTime(String overTime) {
		this.overTime = overTime;
	}

	@Column(name = "start_time", length = 20)
	public String getStartTime() {
		return this.startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	@Column(name = "end_time", length = 20)
	public String getEndTime() {
		return this.endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	@Column(name = "is_examine")
	public Boolean getIsExamine() {
		return this.isExamine;
	}

	public void setIsExamine(Boolean isExamine) {
		this.isExamine = isExamine;
	}

	@Column(name = "content", length = 2000)
	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "rewardOrpenaltie", length = 2000)
	public String getRewardOrpenaltie() {
		return this.rewardOrpenaltie;
	}

	public void setRewardOrpenaltie(String rewardOrpenaltie) {
		this.rewardOrpenaltie = rewardOrpenaltie;
	}

	@Column(name = "lead_advice", length = 2000)
	public String getLeadAdvice() {
		return this.leadAdvice;
	}

	public void setLeadAdvice(String leadAdvice) {
		this.leadAdvice = leadAdvice;
	}

	@Column(name = "state")
	public Integer getState() {
		return this.state;
	}

	public void setState(Integer state) {
		this.state = state;
	}

	@Column(name = "score")
	public Integer getScore() {
		return this.score;
	}

	public void setScore(Integer score) {
		this.score = score;
	}

	@Column(name = "rate", precision = 12, scale = 0)
	public Integer getRate() {
		return this.rate;
	}

	public void setRate(Integer rate) {
		this.rate = rate;
	}

	@Column(name = "is_urge")
	public Boolean getIsUrge() {
		return this.isUrge;
	}

	public void setIsUrge(Boolean isUrge) {
		this.isUrge = isUrge;
	}

	@Column(name = "urge_content", length = 20)
	public String getUrgeContent() {
		return this.urgeContent;
	}

	public void setUrgeContent(String urgeContent) {
		this.urgeContent = urgeContent;
	}

	@Column(name = "partake_users", length = 2000)
	public String getPartakeUsers() {
		return this.partakeUsers;
	}

	public void setPartakeUsers(String partakeUsers) {
		this.partakeUsers = partakeUsers;
	}

	@Column(name = "begin_time", length = 20)
	public String getBeginTime() {
		return beginTime;
	}

	public void setBeginTime(String beginTime) {
		this.beginTime = beginTime;
	}

	@Column(name = "isAllDay")
	public Boolean getIsAllDay() {
		return isAllDay;
	}

	public void setIsAllDay(Boolean isAllDay) {
		this.isAllDay = isAllDay;
	}

}