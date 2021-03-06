package com.wb.vote.domain;

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


/**
 * VoteOption entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "vote_option", catalog = "super_oa")
public class VoteOption implements java.io.Serializable {

	// Fields

	private Integer voId;
	private VoteSubject voteSubject;
	private String voOption;
	private Set<VoteItem> voteItems = new HashSet<VoteItem>(0);

	// Constructors

	/** default constructor */
	public VoteOption() {
	}

	/** full constructor */
	public VoteOption(VoteSubject voteSubject, String voOption,
			Set<VoteItem> voteItems) {
		this.voteSubject = voteSubject;
		this.voOption = voOption;
		this.voteItems = voteItems;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "increment")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "vo_id", unique = true, nullable = false)
	public Integer getVoId() {
		return this.voId;
	}

	public void setVoId(Integer voId) {
		this.voId = voId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "vs_id")
	public VoteSubject getVoteSubject() {
		return this.voteSubject;
	}

	public void setVoteSubject(VoteSubject voteSubject) {
		this.voteSubject = voteSubject;
	}

	@Column(name = "vo_option", length = 350)
	public String getVoOption() {
		return this.voOption;
	}

	public void setVoOption(String voOption) {
		this.voOption = voOption;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "voteOption")
	public Set<VoteItem> getVoteItems() {
		return this.voteItems;
	}

	public void setVoteItems(Set<VoteItem> voteItems) {
		this.voteItems = voteItems;
	}

}