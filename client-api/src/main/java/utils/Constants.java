package utils;

public class Constants {


	/*======================RESOURCE======================*/
	public static final String RESOURCE_REGEX_ORDERBY = "(\\w+\\.(asc|desc)($|,))+";
	public static final String RESOURCE_REGEX_ORDERBY_SINGLEITEM = "(\\w+)\\.(asc|desc)($|,)";


	public static final String PERSISTANCE_UNIT = "CAPSTONE_CCP";

	public static final String BUCKET_NAME = "sonic-arcadia-97210.appspot.com";
	public static final String CREDENTIAL_JSON_FILENAME = "capstone-ccp-credential.json";


	public static final String DEFAULT_RESULT_LIMIT = "100";
	public static final String DEFAULT_ENTITY_GRAPH_TYPE = "javax.persistence.loadgraph";



	/*===============JWT====================*/

	public static final String BUSINESS_TYPE_EMAIL = "emailVerification";
	public static final String CLAIM_BUSINESS_TYPE = "businessType";

	public static final String CLAIM_CONTRACTOR_ID = "contractorId";
	public static final String CLAIM_USERNAME = "username";
	public static final String CLAIM_CONTRACTOR_NAME = "name";
}
