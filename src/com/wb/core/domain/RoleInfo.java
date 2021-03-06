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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.Expose;

/**
 * RoleInfo entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name = "role_info", catalog = "super_oa")
public class RoleInfo implements java.io.Serializable {

	// Fields
	@Expose
	private Integer id;
	@Expose
	private String roleName;
	@Expose
	private String roleDesc;
	@Expose
	private Boolean roleHave;
	@Expose
	private Integer rolePower;
	private Set<RoleAndRight> roleAndRights = new HashSet<RoleAndRight>(0);

	// Constructors

	/** default constructor */
	public RoleInfo() {
	}

	/** full constructor */
	public RoleInfo(String roleName, String roleDesc, Boolean roleHave,
			Integer rolePower, Set<UserInfo> userInfos,
			Set<RoleAndRight> roleAndRights) {
		this.roleName = roleName;
		this.roleDesc = roleDesc;
		this.roleHave = roleHave;
		this.rolePower = rolePower;
		this.roleAndRights = roleAndRights;
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

	@Column(name = "role_name", length = 20)
	public String getRoleName() {
		return this.roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	@Column(name = "role_desc", length = 200)
	public String getRoleDesc() {
		return this.roleDesc;
	}

	public void setRoleDesc(String roleDesc) {
		this.roleDesc = roleDesc;
	}

	@Column(name = "role_have")
	public Boolean getRoleHave() {
		return this.roleHave;
	}

	public void setRoleHave(Boolean roleHave) {
		this.roleHave = roleHave;
	}

	@Column(name = "role_power")
	public Integer getRolePower() {
		return this.rolePower;
	}

	public void setRolePower(Integer rolePower) {
		this.rolePower = rolePower;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "roleInfo")
	public Set<RoleAndRight> getRoleAndRights() {
		return this.roleAndRights;
	}

	public void setRoleAndRights(Set<RoleAndRight> roleAndRights) {
		this.roleAndRights = roleAndRights;
	}
	
	public static void main(String[] args) {
		RoleInfo r = new RoleInfo();
		r.setId(1);
		r.setRoleAndRights(new HashSet<RoleAndRight>());
		r.setRoleDesc("desc");
		r.setRoleHave(true);
		r.setRoleName("roleName");
		r.setRolePower(123);
		
		GsonBuilder builder = new GsonBuilder();
		builder.excludeFieldsWithoutExposeAnnotation();
		Gson gson = builder.create();
		System.out.println(gson.toJson(r));;
	}

}