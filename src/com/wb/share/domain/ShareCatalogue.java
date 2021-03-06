package com.wb.share.domain;

import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;

/**
 * ShareCatalogue entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "share_catalogue", catalog = "super_oa")
public class ShareCatalogue implements java.io.Serializable {

	// Fields
	private static final long serialVersionUID = 1L;
	private Integer id;
	private String catalogueName;
	private Integer parentId;

	// Constructors

	/** default constructor */
	public ShareCatalogue() {
	}

	/** full constructor */
	public ShareCatalogue(String catalogueName, Integer parentId,
			Set<ShareFile> shareFiles) {
		this.catalogueName = catalogueName;
		this.parentId = parentId;
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

	@Column(name = "catalogue_name", length = 20)
	public String getCatalogueName() {
		return this.catalogueName;
	}

	public void setCatalogueName(String catalogueName) {
		this.catalogueName = catalogueName;
	}

	@Column(name = "parentId")
	public Integer getParentId() {
		return this.parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}

}