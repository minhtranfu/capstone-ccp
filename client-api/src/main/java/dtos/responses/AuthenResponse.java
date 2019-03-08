package dtos.responses;

import dtos.Credentials;
import entities.ContractorEntity;

public class AuthenResponse {
	public TokenWrapper tokenWrapper;
	public ContractorEntity contractor;
	public Credentials credentials;


	public TokenWrapper getTokenWrapper() {
		return tokenWrapper;
	}

	public void setTokenWrapper(TokenWrapper tokenWrapper) {
		this.tokenWrapper = tokenWrapper;
	}

	public ContractorEntity getContractor() {
		return contractor;
	}

	public void setContractor(ContractorEntity contractor) {
		this.contractor = contractor;
	}

	public Credentials getCredentials() {
		return credentials;
	}

	public void setCredentials(Credentials credentials) {
		this.credentials = credentials;
	}
}
