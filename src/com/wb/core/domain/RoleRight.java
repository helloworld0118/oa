package com.wb.core.domain;

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
 * RoleRight entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "role_right", catalog = "super_oa")
public class RoleRight implements java.io.Serializable {

	// Fields

	private Integer rightId;
	private String rightName;
	private String rightUrl;
	private String rightIconCls;
	private Set<RoleAndRight> roleAndRights = new HashSet<RoleAndRight>(0);

	// Constructors

	/** default constructor */
	public RoleRight() {
	}

	/** full constructor */
	public RoleRight(String rightName, String rightUrl, String rightIconCls,
			Set<RoleAndRight> roleAndRights) {
		this.rightName = rightName;
		this.rightUrl = rightUrl;
		this.rightIconCls = rightIconCls;
		this.roleAndRights = roleAndRights;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "increment")
	@Id
	@GeneratedValue(generator = "generator")
	@Column(name = "right_id", unique = true, nullable = false)
	public Integer getRightId() {
		return this.rightId;
	}

	public void setRightId(Integer rightId) {
		this.rightId = rightId;
	}

	@Column(name = "right_name", length = 20)
	public String getRightName() {
		return this.rightName;
	}

	public void setRightName(String rightName) {
		this.rightName = rightName;
	}

	@Column(name = "right_url", length = 200)
	public String getRightUrl() {
		return this.rightUrl;
	}

	public void setRightUrl(String rightUrl) {
		this.rightUrl = rightUrl;
	}

	@Column(name = "right_iconCls", length = 20)
	public String getRightIconCls() {
		return this.rightIconCls;
	}

	public void setRightIconCls(String rightIconCls) {
		this.rightIconCls = rightIconCls;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "roleRight")
	public Set<RoleAndRight> getRoleAndRights() {
		return this.roleAndRights;
	}

	public void setRoleAndRights(Set<RoleAndRight> roleAndRights) {
		this.roleAndRights = roleAndRights;
	}

}