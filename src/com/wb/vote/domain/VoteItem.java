package com.wb.vote.domain;

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
 * VoteItem entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "vote_item", catalog = "super_oa")
public class VoteItem implements java.io.Serializable {

	// Fields

	private Integer viId;
	private VoteOption voteOption;
	private VoteSubject voteSubject;
	private Integer userId;

	// Constructors

	/** default constructor */
	public VoteItem() {
	}

	/** full constructor */
	public VoteItem(VoteOption voteOption, VoteSubject voteSubject,
			Integer userId) {
		this.voteOption = voteOption;
		this.voteSubject = voteSubject;
		this.userId = userId;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "increment")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "vi_id", unique = true, nullable = false)
	public Integer getViId() {
		return this.viId;
	}

	public void setViId(Integer viId) {
		this.viId = viId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vo_id")
	public VoteOption getVoteOption() {
		return this.voteOption;
	}

	public void setVoteOption(VoteOption voteOption) {
		this.voteOption = voteOption;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vs_id")
	public VoteSubject getVoteSubject() {
		return this.voteSubject;
	}

	public void setVoteSubject(VoteSubject voteSubject) {
		this.voteSubject = voteSubject;
	}

	@Column(name = "user_id")
	public Integer getUserId() {
		return this.userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

}