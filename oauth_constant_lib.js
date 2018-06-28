/**
 * Code Change History
 *
 * Change Request ID:
 * Change Requested by:
 * Changed by:
 * Changed On:
 * Change Details:
 *
 * Change Request ID:
 * Change Requested by:
 * Changed by:
 * Changed On:
 * Change Details:
 *
 * Change Request ID:
 * Change Requested by:
 * Changed by:
 * Changed On:
 * Change Details:
 */

/**
 * Module Description
 *
 * Version    Date            Author           Remarks
 * 1.00       02 Jan 2015     406203
 *
 */

/**
 * @global
 */

/**
 * default constructor for userException class
 *
 * @returns {Void}
 */


/**
 * create the asos namespace
 */
if(!oauthData){

	var oauthData = {};
}

/**
 * create the asos.constant namespace
 */
if(!oauthData.constant){

	oauthData.constant = {};
}

oauthData.constant.token={

	public: '1a20c4ba3c3464c9b2a0d46ba10f2bd26db450a1097cde3e167d85fb9edcf63e',
	secret: '2927d308eeeaf1aff4c8dca874d71d85dcbec51727ac40d75e6799d95bf0d7ed'


};

oauthData.constant.consumer={

	     public: '857f3237925c76744c925d35c178d5fc0645a3a9a3316aa409ca24bfaf218174',
			 secret: 'df9f92576ad7566f5152dd014a284ebbc52cb79049126e0287f0a0c1e0a04810'


};

oauthData.constant.header_param={


		restletURL_supplier:'https://rest.netsuite.com/app/site/hosting/restlet.nl?script=172&deploy=1',
		restletURL_purchaseOrder:'https://rest.netsuite.com/app/site/hosting/restlet.nl?script=175&deploy=1',
		restletURL_packingList:'https://rest.netsuite.com/app/site/hosting/restlet.nl?script=119&deploy=1',
		restletURL_bills:'https://rest.netsuite.com/app/site/hosting/restlet.nl?script=119&deploy=1',

		remoteAccountID : 'TSTDRV1024523',

		signature_method: 'HMAC-SHA1',

		HTTP_METHOD:'POST',

		oauth_version:'1.0'
};
