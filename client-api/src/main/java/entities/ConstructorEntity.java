package entities;

import javax.persistence.*;

@Entity
@Table(name = "constructor", schema = "capstone_ccp", catalog = "")
public class ConstructorEntity {
	private long id;
	private String name;
	private String email;
	private String phonenumber;
	private String thumbnailImage;

	@Id
	@Column(name = "id", nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "name", nullable = true, length = 255)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Basic
	@Column(name = "email", nullable = true, length = 255)
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Basic
	@Column(name = "phonenumber", nullable = true, length = 45)
	public String getPhonenumber() {
		return phonenumber;
	}

	public void setPhonenumber(String phonenumber) {
		this.phonenumber = phonenumber;
	}

	@Basic
	@Column(name = "thumbnail_image", nullable = true, length = 255)
	public String getThumbnailImage() {
		return thumbnailImage;
	}

	public void setThumbnailImage(String thumbnailImage) {
		this.thumbnailImage = thumbnailImage;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		ConstructorEntity that = (ConstructorEntity) o;

		if (id != that.id) return false;
		if (name != null ? !name.equals(that.name) : that.name != null) return false;
		if (email != null ? !email.equals(that.email) : that.email != null) return false;
		if (phonenumber != null ? !phonenumber.equals(that.phonenumber) : that.phonenumber != null) return false;
		if (thumbnailImage != null ? !thumbnailImage.equals(that.thumbnailImage) : that.thumbnailImage != null)
			return false;

		return true;
	}

}
