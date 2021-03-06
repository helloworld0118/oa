package com.wb.share.domain;

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
 * ShareFile entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "share_file", catalog = "super_oa")
public class ShareFile implements java.io.Serializable {

	// Fields

	private Integer id;
	private String title;
	private ShareCatalogue shareCatalogue;
	private String fileType;
	private String fileUrl;
	private String shareDes;
	private Float fileSize;
	private String shareDate;
	private String shareUser;
	
	// Constructors

	/** default constructor */
	public ShareFile() {
	}

	/** full constructor */
	public ShareFile(ShareCatalogue shareCatalogue, String fileType,
			String fileUrl, String shareDes, Float fileSize, String shareDate,
			Integer shareType) {
		this.shareCatalogue = shareCatalogue;
		this.fileType = fileType;
		this.fileUrl = fileUrl;
		this.shareDes = shareDes;
		this.fileSize = fileSize;
		this.shareDate = shareDate;
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
	@JoinColumn(name = "catalogue_id")
	public ShareCatalogue getShareCatalogue() {
		return this.shareCatalogue;
	}

	public void setShareCatalogue(ShareCatalogue shareCatalogue) {
		this.shareCatalogue = shareCatalogue;
	}

	@Column(name = "file_type", length = 20)
	public String getFileType() {
		return this.fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}

	@Column(name = "file_url", length = 100)
	public String getFileUrl() {
		return this.fileUrl;
	}

	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}

	@Column(name = "share_des", length = 500)
	public String getShareDes() {
		return this.shareDes;
	}

	public void setShareDes(String shareDes) {
		this.shareDes = shareDes;
	}

	@Column(name = "file_size", precision = 12, scale = 0)
	public Float getFileSize() {
		return this.fileSize;
	}

	public void setFileSize(Float fileSize) {
		this.fileSize = fileSize;
	}

	@Column(name = "share_date", length = 20)
	public String getShareDate() {
		return this.shareDate;
	}

	public void setShareDate(String shareDate) {
		this.shareDate = shareDate;
	}
	@Column(name = "title", length = 100)
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	@Column(name = "share_user", length = 50)
	public String getShareUser() {
		return shareUser;
	}

	public void setShareUser(String shareUser) {
		this.shareUser = shareUser;
	}

}