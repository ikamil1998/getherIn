"use strict";
const Model = require("../models");
const {
    checkValidate,
} = require("../utils");
const assert = require('assert')
const androidPackageName = process.env.ANDROID_PACKAGE_NAME;
const iap = require('in-app-purchase')
const { JWT } = require('google-auth-library');
const { google } = require('googleapis');
const axios = require('axios');

google.options({
    auth: new JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        null,
        process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, ['https://www.googleapis.com/auth/androidpublisher'],
    )
});
const androidGoogleApi = google.androidpublisher({ version: 'v3' });


iap.config({
    // If you want to exclude old transaction, set this to true. Default is false:
    appleExcludeOldTransactions: true,
    // this comes from iTunes Connect (You need this to valiate subscriptions):
    applePassword: process.env.APPLE_SHARED_SECRET,

    googleServiceAccount: {
        clientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        privateKey: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    },

    /* Configurations all platforms */
    test: true
        // test: iapTestMode, // For Apple and Google Play to force Sandbox validation only
        // verbose: true, // Output debug logs to stdout stream
});


const processPurchase = async(app, receipt) => {
    await iap.setup();
	Model.NotificationHelp.create({
				  message:  receipt,
				  type: "receipt 1",
				});
					Model.NotificationHelp.create({
				  message:  app,
				  type: "app",
				});
	Model.NotificationHelp.create({
				  message:  "1",
				  type: "1",
				});
    // 1` validationResponse = await iap.validate(receipt);
    return new Promise(async(resolve, reject) => {
        try {
			Model.NotificationHelp.create({
				  message:  receipt,
				  type: "receipt 2",
				});
            const validationResponse = await iap.validate(receipt);
			Model.NotificationHelp.create({
				  message:  "2",
				  type: "2",
				});
            // Sanity check
            assert((app === 'android' && validationResponse.service === 'google') ||
                (app === 'ios' && validationResponse.service === 'apple'));
			Model.NotificationHelp.create({
				  message:  "3",
				  type: "3",
				});
            const purchaseData = iap.getPurchaseData(validationResponse);
			Model.NotificationHelp.create({
				  message:  "4",
				  type: "4",
				});
            const firstPurchaseItem = purchaseData[0];
			Model.NotificationHelp.create({
				  message:  "5",
				  type: "5",
				});
            const { productId } = firstPurchaseItem;
			Model.NotificationHelp.create({
				  message:  "6",
				  type: "6",
				});
            let environment = '';
            // validationResponse contains sandbox: true/false for Apple and Amazon
            // Android we don't know if it was a sandbox account
            if (app === 'ios') {
                environment = validationResponse.sandbox ? 'sandbox' : 'production';
            }
            // From https://developer.android.com/google/play/billing/billing_library_overview:
            // You must acknowledge all purchases within three days.
            // Failure to properly acknowledge purchases results in those purchases being refunded.
            // if (app === 'android' && validationResponse.acknowledgementState === 0) {
            //     await androidGoogleApi.purchases.subscriptions.acknowledge({
            //         packageName: androidPackageName,
            //         subscriptionId: productId,
            //         token: receipt.purchaseToken,
            //     });
            // }
			Model.NotificationHelp.create({
				  message:  "7",
				  type: "7",
				});
            resolve(validationResponse)
        } catch (err) {
            reject(err)
        }
    })
}

exports.getNotificationFromApple = async(req, res, next) => {
	
    try {
       
		let environment = req.body.environment;
        let unified_receipt = req.body.unified_receipt;
		
        let userInfo = null;
        if (unified_receipt) {
			
           let latest_receipt_info = unified_receipt.latest_receipt_info;
		   
            
            
                
                userInfo = await getuserInfo(latest_receipt_info);
                 
                if (userInfo != null) {
                    let is_valid = 0;
                    let expires_date_ms = latest_receipt_info[0].expires_date_ms;
                    var date = new Date(Date.now()); // to get date in ms
                    var now = date.getTime();
					
			
                    if (expires_date_ms > now) {
                        is_valid = 1;
                        
                    }
                    const cp = await Model.ConsumerPackage.findOne({
                        where: { userId: userInfo.userId },
                    });
                   
			
                    cp.isValid = is_valid;
					cp.end_date = latest_receipt_info[0].expires_date;
                    cp.save();
                } else {
                    res.status(403).send({ msg: "failed" });
                }
            }
       
        //  if process successfully
        res.status(200).send({ msg: "success" });

    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};
exports.getNotificationFromGooglePlay = async(req, res, next) => {
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString(
            'utf-8'
        );
        let data = JSON.parse(message);

      

       
        const purchaseToken = data.subscriptionNotification.purchaseToken;
        const notificationType = data.subscriptionNotification.notificationType;

        const ur = await Model.UserReceipt.findOne({
            where: { receipt: purchaseToken },
        });
        if (ur != null) {
            let is_valid = 1;
            if (notificationType == 3 ||
                notificationType == 5 ||
                notificationType == 7 ||
                notificationType == 10 ||
                notificationType == 11 ||
                notificationType == 12 ||
                notificationType == 13) {
                is_valid = 0;
            }
            
            const cp = await Model.ConsumerPackage.findOne({
                where: { userId: ur.userId },
            });
            cp.isValid = is_valid;
            cp.save();
        } else {
            res.status(200).send();
        }

        //  if process successfully
        res.status(200).send();


    } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
};

async function getuserInfo(latest_receipt_info) {

    for await (const contents of latest_receipt_info) {
        const user_Info = await Model.UserReceipt.findOne({
            where: { web_order_line_item_id: contents.web_order_line_item_id, appType: 'ios' },
        });
        if (user_Info) {
            return (user_Info);
        }
    }
    return null;

}



exports.saveReceipt = async(req, res) => {
	
    const { appType, purchase } = req.body;
    assert(['ios', 'android'].includes(appType));
					
    const receipt = appType === 'ios' ? purchase.transactionReceipt : {
        packageName: androidPackageName,
        productId: purchase.productId,
        purchaseToken: purchase.purchaseToken,
        subscription: true,
    };

    try{
		Model.NotificationHelp.create({
				  message: "processPurchase",
				  type: "processPurchase",
				});
        let web_order_line_item_id = null;
		Model.NotificationHelp.create({
				  message: appType,
				  type: "appType",
				});
        if (appType == "android") {
            const cp = await Model.ConsumerPackage.findOne({
                where: { userId: req.tokenUserId },
            });
            const _package = await Model.Package.findOne({ where: { pack_android_ID: purchase.productId } })
            cp.packageId = _package.id;
            cp.isValid = 1;
            cp.date = Date.now();
            let endDatePackage =new  Date();
            endDatePackage.setDate(endDatePackage.getDate() + _package.expiry)
            cp.end_date = endDatePackage.toISOString();
            cp.save();
        } else {
			Model.NotificationHelp.create({
				  message:  "IOS",
				  type: "IOS",
				});
            const cp = await Model.ConsumerPackage.findOne({
                where: { userId: req.tokenUserId },
            });
            let respo = null;
			 Model.NotificationHelp.create({
				  message: cp,
				  type: "ConsumerPackage",
				});
            await axios.post('https://buy.itunes.apple.com/verifyReceipt', {
                    'receipt-data': purchase.transactionReceipt,
                    'password': process.env.APPLE_SHARED_SECRET
                })
                .then(async function(response) {
                    if (response.data.status == 21007) {
                        await axios.post('https://sandbox.itunes.apple.com/verifyReceipt', {
                                'receipt-data': purchase.transactionReceipt,
                                'password': process.env.APPLE_SHARED_SECRET
                            })
                            .then(async function(response) {
                                 
								respo = response.data.latest_receipt_info;
								 Model.NotificationHelp.create({
								  message: respo,
								  type: "sandbox respo",
								});
							})
                            .catch(function(error) {
								 Model.NotificationHelp.create({
												  message: error,
												  type: "sandbox error",
												});                               
							   console.log(error);
                            });
                    }else{
					    respo = response.data.latest_receipt_info;
						 Model.NotificationHelp.create({
								  message: respo,
								  type: "real respo",
								});
					}

                })
                .catch(function(error) {
						 Model.NotificationHelp.create({
				  message: error,
				  type: "real error",
				});
				   console.log(error);
                });
               Model.NotificationHelp.create({
					  message: respo,
					  type: "respo",
					});
						
            web_order_line_item_id = respo[0].web_order_line_item_id;
             Model.NotificationHelp.create({
					  message: web_order_line_item_id,
					  type: "web_order_line_item_id",
					});
			const _package = await Model.Package.findOne({ where: { pack_ios_ID: respo[0].product_id } })
            cp.packageId = _package.id;
            cp.isValid = 1;
            cp.date = Date.now();
            cp.end_date = respo[0].expires_date;
            cp.save();
			
        }
        // const _purchase = JSON.stringify(purchase)
        const _purchase = appType === 'ios' ? purchase.transactionReceipt : purchase.purchaseToken;
         Model.NotificationHelp.create({
					  message: _purchase,
					  type: "_purchase",
					});
		 Model.NotificationHelp.create({
		  message: req.tokenUserId,
		  type: "req.tokenUserId",
		});
		 Model.NotificationHelp.create({
		  message: appType,
		  type: "appType",
		});
		
		await Model.UserReceipt.create({
            userId: req.tokenUserId,
            receipt: _purchase,
            web_order_line_item_id: web_order_line_item_id,
            appType: appType,
        });
		 Model.NotificationHelp.create({
		  message: "Success Entered now row to subscriptions table.",
		  type: "Success",
		});

        // await Model.UserReceipt.findOrCreate({ where: { userId: req.tokenUserId }, defaults: { receipt: _purchase, web_order_line_item_id: web_order_line_item_id, appType: appType } })
        res.send({ msg: "successfully processed" });
    }catch(err){
        res.status(400).send(err)
    }
}


// ! work

exports.test = async(req, res) => {
	
		/*Model.NotificationHelp.create({
				  message: "processPurchase",
				  type: "processPurchase",
				});*/
	
res.send({ msg: "successfully processed" });	
	//return "OK";			
    
}

