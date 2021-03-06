package com.wb.vote.domain;

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
 * VoteSubject entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "vote_subject", catalog = "super_oa")
public class VoteSubject implements java.io.Serializable {

	// Fields

	private Integer vsId;
	private String vsTitle;
	private String vsUser;
	private Integer vsType;
	private String vsDes;
	private String vsCreateTime;
	private String vsBeginTime;
	private String vsEndTime;
	private Boolean vsIsAllDay;
	private Set<VoteItem> voteItems = new HashSet<VoteItem>(0);
	private Set<VoteOption> voteOptions = new HashSet<VoteOption>(0);

	// Constructors

	/** default constructor */
	public VoteSubject() {
	}

	/** full constructor */
	public VoteSubject(String vsTitle, String vsUser, Integer vsType,
			String vsDes, String vsCreateTime, String vsBeginTime,
			String vsEndTime, Boolean vsIsAllDay, Boolean vsIsShow,
			Set<VoteItem> voteItems, Set<VoteOption> voteOptions) {
		this.vsTitle = vsTitle;
		this.vsUser = vsUser;
		this.vsType = vsType;
		this.vsDes = vsDes;
		this.vsCreateTime = vsCreateTime;
		this.vsBeginTime = vsBeginTime;
		this.vsEndTime = vsEndTime;
		this.vsIsAllDay = vsIsAllDay;
		this.voteItems = voteItems;
		this.voteOptions = voteOptions;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "increment")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "vs_id", unique = true, nullable = false)
	public Integer getVsId() {
		return this.vsId;
	}

	public void setVsId(Integer vsId) {
		this.vsId = vsId;
	}

	@Column(name = "vs_title", length = 50)
	public String getVsTitle() {
		return this.vsTitle;
	}

	public void setVsTitle(String vsTitle) {
		this.vsTitle = vsTitle;
	}

	@Column(name = "vs_user", length = 50)
	public String getVsUser() {
		return this.vsUser;
	}

	public void setVsUser(String vsUser) {
		this.vsUser = vsUser;
	}

	@Column(name = "vs_type")
	public Integer getVsType() {
		return this.vsType;
	}

	public void setVsType(Integer vsType) {
		this.vsType = vsType;
	}

	@Column(name = "vs_des", length = 500)
	public String getVsDes() {
		return this.vsDes;
	}

	public void setVsDes(String vsDes) {
		this.vsDes = vsDes;
	}

	@Column(name = "vs_createTime", length = 20)
	public String getVsCreateTime() {
		return this.vsCreateTime;
	}

	public void setVsCreateTime(String vsCreateTime) {
		this.vsCreateTime = vsCreateTime;
	}

	@Column(name = "vs_beginTime", length = 20)
	public String getVsBeginTime() {
		return this.vsBeginTime;
	}

	public void setVsBeginTime(String vsBeginTime) {
		this.vsBeginTime = vsBeginTime;
	}

	@Column(name = "vs_endTime", length = 20)
	public String getVsEndTime() {
		return this.vsEndTime;
	}

	public void setVsEndTime(String vsEndTime) {
		this.vsEndTime = vsEndTime;
	}

	@Column(name = "vs_isAllDay")
	public Boolean getVsIsAllDay() {
		return this.vsIsAllDay;
	}

	public void setVsIsAllDay(Boolean vsIsAllDay) {
		this.vsIsAllDay = vsIsAllDay;
	}


	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "voteSubject")
	public Set<VoteItem> getVoteItems() {
		return this.voteItems;
	}

	public void setVoteItems(Set<VoteItem> voteItems) {
		this.voteItems = voteItems;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "voteSubject")
	public Set<VoteOption> getVoteOptions() {
		return this.voteOptions;
	}

	public void setVoteOptions(Set<VoteOption> voteOptions) {
		this.voteOptions = voteOptions;
	}
    @Override
    public int hashCode() {
    	return this.getVsId();
    }
    @Override
    public boolean equals(Object obj) {
    	return this.getVsId().equals(((VoteSubject)obj).getVsId());
    }
}