EpaDash Backend Technical Requirements
and Core System Architecture
DocumentID EPADASH-BE-ARCH-001
Version 0.2—Revisedaftertechnicalreview
Status Submittedforapproval(revision2)
Prepared 8November2026
Scope OriginalAssignmentTask5
STATUS:SUBMITTEDFORAPPROVAL—REVISION2. Thisspecificationrespondstothetech-
nicalreviewfeedback. Companystandards,providers,hostingandfinalbusinessrulesremainsubjectto
technical review; the baseline decisions in Section 2.3 are recorded so that approval can be given on a
concretefoundation.
Revisionnote: Version0.1wasreturnedwiththefeedbackthatdatabaserelationships,APIcapabilities,pay-
ment processing and delivery management were described only conceptually or deferred to later work. This
revisionspecifieseachoftheminimplementabledetail: completeentityandrelationshipdefinitionswithcar-
dinalities and delete rules, an endpoint catalogue with role access and request and response structures, the
paymentprocessingdesignandthedeliverymanagementdesign. Openproviderandpolicychoiceshavebeen
replacedwithexplicitbaselinedecisions(Section2.3)sothatapprovalcanbegivenonaconcretefoundation.
Section1.2mapseachreviewpointtothesectionsthataddressit.
Contents
1 Executivesummary 4
1.1 Revisionhistory . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
1.2 Reviewfeedbackresolution . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
2 Assignmentscope,assumptionsanddecisions 5
2.1 In-scopebackenddomains . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
2.2 Confirmedrequirementsfromtheassignment . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
2.3 Designdecisionsandassumptions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
3 Technologystackanddatabasestrategy 7
3.1 Technologystack . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
3.2 Databasestrategy. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
4 Architecturestyleanddeploymentshape 8
4.1 Recommendedstyle: modularmonolith . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
4.2 Logicalrequestflow . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
4.3 Layerresponsibilities. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
4.4 Runtimecomponents . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
4.5 Cross-cuttingdesign . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
5 Logicalmoduleboundaries 12
6 Databasedesignandrelationships 13
6.1 Modellingconventions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
6.2 Entitycatalogue . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
6.3 Relationshipsanddeletebehaviour . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 19
6.4 Entityrelationshipdiagrams . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 20
6.5 Integrityandconcurrencyrules . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 20
6.6 Indexingstrategy . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 22
Page1of62

6.7 Migrations,seeddataanddatalifecycle . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23
7 Rolesandaccesscontrol 24
7.1 Roles . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 24
7.2 Permissionmatrix . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 24
7.3 Authorisationrules . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 26
8 Authenticationandaccountsecurity 26
8.1 Authenticationmodel . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 26
8.2 Requiredflows . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 27
8.3 Passwordandcredentialhandling . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 27
8.4 Accountandapprovalstatuses . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 29
9 APIrequirementsandconventions 30
9.1 Generalconventions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 30
9.2 Commonresponseshape . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 30
9.3 Errorcodes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 31
9.4 Ratelimits . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 32
9.5 Endpointcatalogue . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 32
9.6 Corerequestandresponsestructures . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 37
10 Corebusinessworkflows 40
10.1 Merchantandproductdiscovery . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 40
10.2 Ordercreation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 41
10.3 Orderstatuslifecycle . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 42
10.4 Paymentprocessing . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 44
10.5 Deliverymanagement . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 48
10.6 Notifications . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 52
10.7 Administrationandaudit . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 53
11 Third-partyintegrationrequirements 54
11.1 Integrationsummary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 54
11.2 Adaptercontracts . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 55
11.3 Paymentgatewayrequirements . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 55
11.4 Mappingrequirements . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 56
11.5 Notificationrequirements . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 56
11.6 Fileandmediastorage . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 56
11.7 Configurationandsecrets . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 57
12 Security,privacyandoperationalrequirements 57
12.1 Securityandprivacy . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 57
12.2 Non-functionaltargets . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 58
12.3 Environmentsanddeliveryprocess . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 58
13 Testingandqualitystrategy 59
14 Proposedrepositorystructure 60
15 Implementationroadmap 61
16 Deliveryandapprovalchecklist—Task5 61
List of Figures
1 Systemarchitecturecontext: requestpath,domainmodules,provideradaptersandexternalservices. 10
2 Logicalrequestflowthroughthebackendlayers. . . . . . . . . . . . . . . . . . . . . . . . . . . 10
3 Entity relationships: identity, merchants and catalogue. Link tables, option groups and staff
recordsaredescribedintheentitycatalogue. . . . . . . . . . . . . . . . . . . . . . . . . . . . . 21
4 Entityrelationships: ordersandorderitems. . . . . . . . . . . . . . . . . . . . . . . . . . . . . 21
5 Entityrelationships: payments,ledgeranddelivery. Theledgeralsoreferencesorders,merchants
andriders,andwebhookeventsarematchedtopaymentsbyproviderreference. . . . . . . . . . . 22
6 Loginflow. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 28
7 Refresh-tokenrotationandreusedetection. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 28
8 Passwordrecoveryandresetsequence. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 29
9 Orderstatuslifecycle. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 43
Page2of62

10 Onlinepaymentinitiationandconfirmationsequence. . . . . . . . . . . . . . . . . . . . . . . . 45
11 Paymentwebhookverificationandidempotentprocessing. . . . . . . . . . . . . . . . . . . . . . 46
12 Riderdispatchandassignmentsequence. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 50
13 Deliverystatuslifecycle. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 52
14 End-to-endworkflowfromordercreationtodeliverycompletion. . . . . . . . . . . . . . . . . . 54
List of Tables
1 Revisionhistory . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
2 Resolutionofreviewfeedback . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
3 Baselinedesigndecisions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
4 Backendtechnologystack . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
5 Runtimecomponents . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
6 Logicalmoduleboundaries . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
7 Entities: identityandaccess . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 14
8 Entities: roleprofiles . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 14
9 Entities: merchants,catalogueandinventory . . . . . . . . . . . . . . . . . . . . . . . . . . . . 15
10 Entities: orders . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 16
11 Entities: paymentsandmoney . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17
12 Entities: delivery . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17
13 Entities: notifications,messagingandaudit . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 18
14 Relationshipmatrix . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 19
15 Principalindexes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23
16 Userrolesandintendedaccess . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 24
17 Permissionmatrix(own=onlyresourcesbelongingtotheprincipal) . . . . . . . . . . . . . . . 25
18 Authenticationparameters . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 26
19 Accountstatustransitions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 29
20 APIconventions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 30
21 Errorcodes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 31
22 Defaultratelimits . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 32
23 Authenticationendpoints . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 32
24 Userandprofileendpoints . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 33
25 Merchantdiscoveryandcatalogueendpoints(public) . . . . . . . . . . . . . . . . . . . . . . . . 33
26 Merchantmanagementendpoints . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 34
27 Orderandpaymentendpoints(customer) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 35
28 Rideranddeliveryendpoints. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 35
29 Notificationendpoints . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 36
30 Administrationandsystemendpoints . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 36
31 Orderstatustransitions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 42
32 Paymentstatustransitions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 44
33 Ledgerentries . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 47
34 Paymentfailurehandling . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 48
35 Deliverystatustransitions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 48
36 Deliveryconfigurationdefaults(platformsettings) . . . . . . . . . . . . . . . . . . . . . . . . . 51
37 Deliveryexceptions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 52
38 Notificationevents . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 52
39 Third-partyintegrations . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 54
40 Principalconfigurationvariables. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 57
41 Initialnon-functionaltargets . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 58
42 Implementationphases . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 61
43 Task5acceptancecriteriaandevidence . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 61
44 Approvalrecord . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 62
Page3of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
1 Executive summary
EpaDashisadeliveryplatformonwhichcustomersorderfrommerchants,merchantsprepareorders,rid-
ersdeliverthemandadministratorsoverseetheplatform. Thebackendmustthereforesupportcustomer,
merchant,riderandadministratormanagement;merchantandproductdiscovery;orderprocessing;pay-
ments;deliverymanagement;notifications;andadministration.
The recommended design is a modular monolith backed by PostgreSQL and exposed through a ver-
sionedRESTAPI.TheimplementationstackisNode.jswithTypeScript,Express.js,PostgreSQL,Prisma
ORM,Zodvalidation,OpenAPI3.1documentationandVitest/Supertesttesting. Aseparateworkerpro-
cess, sharing the same code base, runs background jobs for notifications, payment reconciliation, order
timeoutsandriderdispatchretries.
Thisdocumentdefinesthetechnologystack,systemarchitecture,coremodules,thecompletedatamodel
withrelationships,theroleandpermissionmodel,authenticationandauthorisation,theAPIsurface,the
order, payment and delivery workflows, and the payment, mapping and notification integrations. It is
intendedtobesuﬀicientforthedetaileddesignandimplementationtasksthatfollow,withoutthosetasks
havingtotakefurtherarchitecturaldecisions.
1.1 Revisionhistory
Table1. Revisionhistory
Version Date Description
0.1 7November2026 Initialdraft: stack,architecturestyle,modulelist,conceptualentityoutline.
Returnedafterreview.
0.2 8November2026 Revisedafterreview: fulldatamodelwithrelationships,completeAPI
catalogue,paymentprocessingdesign,deliverymanagementdesign,
concreteintegrationdecisions,roadmapandtraceability.
1.2 Reviewfeedbackresolution
Table2. Resolutionofreviewfeedback
Reviewconcern Resolutioninthisversion Sections
Databaserelationships Entitycatalogueof36tableswithattributes,keysandconstraints; Section6
remainconceptual relationshipmatrixwithcardinality,foreignkeyanddelete
behaviour;threeentityrelationshipdiagrams;integrity,
concurrency,indexinganddata-lifecyclerules
APIcapabilitiesdeferred APIconventions,responseanderrormodel,ratelimits,a Section9
toalatertask completeendpointcatalogueperroleanddomain,andrequest
andresponsestructuresforthecoreendpoints
Page4of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
Reviewconcern Resolutioninthisversion Sections
Paymentprocessingnot Paymentmodelandstatemachine,initiationandwebhook Section10.4,
specified sequences,reconciliation,refunds,ledgerandsettlement,cashon Section11
delivery,failurehandlingandsecuritycontrols
Deliverymanagementnot Deliverystatemachine,dispatchalgorithmwithconcurrency Section10.5
specified control,tracking,proofofdelivery,feesandearnings,failureand
reassignmentrules
Documentnot Decisionregisterreplacingopenitems,permissionmatrix, Section2.3,
comprehensiveenoughas implementationroadmapandacceptance-criteriatraceability Section7,
afoundation Section15,
Section16
2 Assignment scope, assumptions and decisions
2.1 In-scopebackenddomains
1. Customermanagement: customeraccounts,profiles,addresses,accountstatusandcustomer-facing
access.
2. Merchant management: merchant accounts and public merchant profiles, categories, operating
hours,operatingstatusanddeliveryavailability.
3. Rider management: rider accounts, verification and status information, availability and delivery
participation.
4. Product management: product catalogue, categories, options, publication state, price, availability
andinventory.
5. Orderprocessing: ordercreation,orderitems,pricingsnapshotsandtheorderstatuslifecycle.
6. Deliverymanagement: deliveryassignment,riderassociation,deliverystatus,trackingeventsand
proofofdelivery.
7. Payments: paymentinitiationandreference,providerverification,transactionstatus,refunds,ledger
andreconciliationrecords.
8. Notifications: notificationeventsanddeliverythroughconfiguredchannels.
9. Administration: privilegedaccountandplatformoperations,andauditrecords.
10. Cross-cuttingcapabilities: authentication, authorisation, validation, consistenterrors, logging, se-
curity,APIdocumentation,testsanddatabasemigrations.
2.2 Confirmedrequirementsfromtheassignment
• Merchantlisting,search,categoryfiltering,profileretrieval,operatingstatusanddeliveryavailability.
• Productcatalogueretrieval,productsearch,categoryfiltering,details,pricingandavailability.
• Public discovery must not expose unpublished products or merchant listings that are not active and
intendedforpublicdisplay.
Page5of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
• Registration, login, logout, password recovery and reset, session and token management, and role-
basedaccess.
• Customer, merchant, riderandadministratorroles, profilemanagement, accountstatus, verification
requirementsandpermissionenforcement.
• Relationaldatabaseentities,relationships,constraints,indexes,migrationsandseedscripts.
• Order,payment,riderassignmentanddeliveryworkflows.
• API contracts for authentication, customer, merchant, product, order, payment, rider, delivery, noti-
ficationandadministrationdomains.
• Payment,mappingandnotificationintegrationrequirements.
2.3 Designdecisionsandassumptions
Theassignmentdoesnotnameapaymentgateway,mappingprovider,messagingprovider,hostingplat-
form, expected traﬀic or jurisdiction-specific policies. Rather than leave these open, the decisions in
Table3areadoptedasthebaseline. Eachdecisionisisolatedbehindaninterface,aconfigurationvalue
or a single module, so replacing it later does not change the architecture, the data model or the work-
flowsinthisdocument. Wheretheorganisationmandatesadifferentstandard,thatstandardreplacesthe
correspondingdecision.
Table3. Baselinedesigndecisions
ID Topic Decision
D1 Technology Node.jsLTS,TypeScript(strict),Express.js,PostgreSQL,PrismaORM,Zod,
stack OpenAPI3.1,VitestandSupertest(Section3).
D2 Architecture Modularmonolith: oneAPIprocessandoneworkerprocessbuiltfromthesame
codebase. Nomicroservicesinitially.
D3 Paymentgateway Paystackhostedcheckoutforcardsandmobilemoney,behindaPaymentProvider
adapter. Cashondeliveryissupportedasaninternalpaymentmethod.
D4 Mapping GoogleMapsPlatform(GeocodingandRoutes/DistanceMatrix)behinda
provider MappingProvideradapter,withastraight-line(Haversine)fallback.
D5 Notifications In-appnotificationspluspush(FirebaseCloudMessaging),SMSandemailthrough
NotificationProvideradapters;deliverythroughaqueuewithretry.
D6 Currencyand Onecurrencyperdeployment(ISO4217codeinconfiguration);amountsstoredas
money NUMERIC(12,2)inmajorunitsandconvertedtominorunitsonlywhencallingthe
gateway.
D7 Backgroundjobs PostgreSQL-backedjobqueue(pg-boss)runbytheworkerprocess;noadditional
infrastructure. Redismaybeaddedlaterforcachinganddistributedratelimiting.
D8 Tokensand Short-livedJWTaccesstokenandrotatingopaquerefreshtokenstoredhashed
sessions server-side(Section8.1).
D9 Hosting ContaineriseddeploymentwithamanagedPostgreSQLserviceandS3-compatible
objectstorage;platformchoiceisnotmandatedbythearchitecture.
Page6of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
ID Topic Decision
D10 Real-time Version1usesRESTpollingfororderanddeliverytrackingtogetherwithpush
behaviour notifications. WebSocketorserver-senteventsareadefinedextensionpoint.
D11 Stockrule Stockisreservedwhenanorderiscreated,committedwhentheorderisplacedand
releasedoncancellation,rejectionorpaymenttimeout(Section10.2).
D12 Dispatch Automaticnearest-availableriderdispatchwithadministratormanualoverride
(Section10.5).
D13 Roles Oneroleperuseraccount: CUSTOMER,MERCHANT,RIDER,ADMINor
SUPER_ADMIN.
3 Technology stack and database strategy
3.1 Technologystack
Table4. Backendtechnologystack
Layer Choice Reason/notes
Runtime Node.jsLTS Matureserver-sideJavaScriptruntime
Language TypeScript,strictmode Compile-timetypecheckingandmaintainability
HTTP Express.js Small,flexibleRESTframework;layersarekeptexplicit
framework
Database PostgreSQL15orlater Relationalintegrity,transactions,rowlocking,partialindexes
andJSONB
ORM/ PrismaORMandPrisma Typeddatabaseaccess;migrationsplusreviewedrawSQLfor
migrations Migrate featuresPrismadoesnotmodel
Validation Zod Runtimevalidationofrequestpayloads,responsesand
environmentconfiguration
APIcontract OpenAPI3.1 GeneratedfromtheZodschemassothecontractcannotdrift
fromthecode
APIexplorer SwaggerUI Human-readableinteractiveAPIreference
Backgroundjobs pg-boss QueuestoredinPostgreSQL;retries,schedulingandlocking
withoutnewinfrastructure
HTTPhardening helmet,cors, Secureheaders,originallow-listandratelimiting
express-rate-limit
Tests Vitest+Supertest UnitandHTTPintegrationtestingagainstarealPostgreSQL
testdatabase
Logging Pino Structuredlogswithredactionofsecretsandsensitivefields
Page7of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
Layer Choice Reason/notes
Password Argon2id Password-specificone-wayhashing
hashing
Objectstorage S3-compatiblestorage Productandmerchantimages,riderdocuments
Sourcecontrol Git+GitHub Branching,reviewandtraceability
Containers DockerandDocker RepeatablelocalPostgreSQLenvironmentanddeployable
Compose images
ThefinaldecisiononthestackisrecordedinanArchitectureDecisionRecord(ADR-0001). Ifacompany-
mandatedstackexists,thatstandardoverridesthisproposal.
3.2 Databasestrategy
• Engine and layout: one PostgreSQL primary database shared by all modules, in a single schema.
Eachtableisownedbyexactlyonemodule(Table6).
• Schema management: Prisma Migrate with forward-only, reviewed migrations. Constraints that
Prisma cannot express (partial unique indexes, CHECK constraints, trigram indexes, immutability
triggers)areaddedashand-writtenSQLinsidethesamemigrations.
• Identifiers and time: UUID primary keys for business entities and BIGINT identity keys for high-
volume log tables. All timestamps are TIMESTAMPTZ stored in UTC; local time is a presentation
concern.
• Money: NUMERIC(12,2)inmajorunitswithanexplicitcurrencycode;neverfloatingpoint.
• Deletion: soft delete (deleted_at) for users, merchants and products so that order, payment and
audithistoryisneverorphaned. Financialandaudittablesareappend-only.
• Transactions: everymulti-rowbusinessoperation(ordercreation,stockreservation,paymentconfir-
mation,deliveryassignment)runsinoneinteractivePrismatransaction. Contendedrowsarelocked
withSELECT ... FOR UPDATE(orSKIP LOCKEDforqueues).
• Searchandgeography: trigram(pg_trgm)indexesfornamesearch;latitudeandlongitudecolumns
with bounding-box filtering and Haversine distance. PostGIS is the documented upgrade path if
radiusorpolygonqueriesoutgrowthis.
• Environments: local development and automated tests use Docker Compose PostgreSQL; staging
andproductionuseamanagedinstancewithautomatedbackups(Section12).
• Seeddata: referencedata(roles,categories,configurationdefaults)isseededineveryenvironment;
sampledataexistsonlyindevelopmentandtest.
4 Architecture style and deployment shape
Page8of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
4.1 Recommendedstyle: modularmonolith
One backend application is deployed as a single service. Internally it is divided into domain modules
withclearinterfaces. ModulesshareonePostgreSQLdatabasebutmustnotreachintoanothermodule’s
internal implementation or tables; cross-module interaction occurs through exported service interfaces
ordomainevents.
Whythisistherecommendedstartingpoint
• Theplatformisaconnectedsystemwithtransactionalrelationshipsacrossusers,merchants,products,
orders,paymentsanddeliveries.
• Oneservicesimplifieslocalsetup,deployment,debuggingandend-to-endtesting.
• Databasetransactionscanbeuseddirectlyforoperationsthatmustbeatomic.
• Moduleboundariespreservemaintainabilityandleaveroomforlaterextractionifmeasurableneeds
arise.
Microservicesarenotrecommendedastheinitialdefaultbecausethereisnotraﬀic,scaling,independent
releaseororganisationalrequirementthatjustifiesdistributeddeploymentcomplexity.
Figure1showsthearchitecturecontext,includingthedomainmodulesdescribedinSection5.
4.2 Logicalrequestflow
Client application → API router → authentication middleware → request validation → controller →
application/service layer → repository/data access → PostgreSQL. External provider interactions are
performed by dedicated adapters. Responses use a common success and error envelope (Section 9.2).
Figure2illustratestheflow.
4.3 Layerresponsibilities
• Routes: bindHTTPmethodandpathtomiddlewareandcontroller;nobusinessrules.
• Middleware: authentication, permission checks, request IDs, rate limiting and common request
concerns.
• Controllers: translate HTTP requests into application commands and map results to HTTP re-
sponses.
• Services/usecases: enforcebusinessrulesandcoordinatetransactions.
• Repositories: encapsulate database reads and writes; always scoped by the authenticated principal
whereownershipapplies.
• Provideradapters: wrappayment,mappingandmessagingproviderAPIsbehindtheinterfacesin
Section11.2.
• Schemas: validaterequest,responseandenvironmentconfiguration.
• Tests: verifydomainrules,APIbehaviour,securityboundariesandintegrationcontracts.
Page9of62

| EPADASH-BE-ARCH-001 |     | Version0.2—Revisedaftertechnicalreview |     |     |
| ------------------- | --- | -------------------------------------- | --- | --- |
Customer/Merchant/Rider/AdminClients
RESTAPIv1
Auth,RBAC,Validation,RateLimits,RequestID
RoutesandControllers
ApplicationServices/UseCases
Domainmodulesinonedeployableservice(modularmonolith)
Products&
| Auth&Sessions | Users&Access | Merchants |     | Orders |
| ------------- | ------------ | --------- | --- | ------ |
Inventory
Administration
| Payments | Deliveries | Notifications | Riders |     |
| -------- | ---------- | ------------- | ------ | --- |
&Audit
allmodules
| Payment         | Mapping         | Notification    |     |     |
| --------------- | --------------- | --------------- | --- | --- |
| ProviderAdapter | ProviderAdapter | ProviderAdapter |     |     |
PostgreSQL
Mapping/
Email/SMS/
| PaymentGateway | Geolocation |     |     |     |
| -------------- | ----------- | --- | --- | --- |
PushProvider
Provider
Figure1. Systemarchitecturecontext: requestpath,domainmodules,provideradaptersandexternalservices.
Authentication
| Clientapplication | APIrouter |     |     | Requestvalidation |
| ----------------- | --------- | --- | --- | ----------------- |
middleware
Application/
| PostgreSQL | Repository/ |     |     |     |
| ---------- | ----------- | --- | --- | --- |
Controller
|     | dataaccess | servicelayer |     |     |
| --- | ---------- | ------------ | --- | --- |
Provideradapters
Responsesuseacommon
(payment,mapping,
success/errorenvelope.
messaging)
Externalproviders
Figure2. Logicalrequestflowthroughthebackendlayers.
Page10of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
4.4 Runtimecomponents
Table5. Runtimecomponents
Component Responsibility Scaling
APIprocess ServestheRESTAPI;stateless;verifiesaccesstokens Horizontal,behindaload
andenforcesauthorisation balancer
Workerprocess Consumespg-bossqueues: notificationdelivery,outbox Oneormoreinstances;jobs
dispatch,paymentreconciliation,orderandpayment arelockedsoeachrunsonce
timeouts,dispatchretries,data-retentionjobs
PostgreSQL Systemofrecord,transactionalstateandjobqueue Verticalfirst;readreplicas
laterifrequired
Objectstorage Imagesandriderdocuments,accessedthroughpresigned Providermanaged
URLs
Externalproviders Paymentgateway,mapping,push,SMSandemail Providermanaged
4.5 Cross-cuttingdesign
• Errorhandling: servicesthrowtypedapplicationerrorsthatasingleerrormiddlewaremapstothe
standarderrorenvelope;unexpectederrorsreturnagenericINTERNAL_ERRORandareloggedwiththe
requestID.
• Requesttracing: everyrequestreceivesarequestID,returnedintheresponseandattachedtoevery
logline.
• Idempotency: ordercreationandpaymentinitiationrequireanIdempotency-Keyheader,enforced
byuniqueconstraints;paymentwebhooksarededuplicatedbyprovidereventID.
• Domaineventsandoutbox: statechangeswriteaneventrowtooutbox_eventsinthesametrans-
action;theworkerturnseventsintonotificationsandauditentries,soanotificationfailurecannever
corruptorderorpaymentstate.
• Audit: privilegedandsensitiveactionswriteimmutableaudit_logsrows.
• Configuration: allconfigurationisreadonceatstart-up,validatedwithZod,andtheprocessrefuses
tostartoninvalidconfiguration.
Page11of62

| EPADASH-BE-ARCH-001 |                   | Version0.2—Revisedaftertechnicalreview |     |
| ------------------- | ----------------- | -------------------------------------- | --- |
| 5 Logical           | module boundaries |                                        |     |
Table6. Logicalmoduleboundaries
| Module | Responsibilities | Ownedtables | Primary |
| ------ | ---------------- | ----------- | ------- |
dependencies
Auth Registration,login,logout,refresh, sessions,otp_codes, Users,notifications
|     | passwordreset,verification,sessions | password_reset_tokens |     |
| --- | ----------------------------------- | --------------------- | --- |
Users& Accounts,roles,profiles,addresses, roles,users,customers, Auth,audit
| Access | accountstatus,permissions | admins,addresses |     |
| ------ | ------------------------- | ---------------- | --- |
Merchants Merchantprofileandapproval, categories,merchants, Users,products
|     | categories,hours,deliveryzones,staff, | merchant_staff,merchant_   |     |
| --- | ------------------------------------- | -------------------------- | --- |
|     | publicvisibility                      | categories,merchant_hours, |     |
delivery_zones
Products Products,options,publicationstate, products,product_option_ Merchants,
|     | pricing | groups,product_options | inventory |
| --- | ------- | ---------------------- | --------- |
Inventory Stocklevels,reservations,adjustments, inventory_items,inventory_ Products,orders
|     | movementhistory | movements |     |
| --- | --------------- | --------- | --- |
Orders Quoteandordervalidation,orderitems, orders,order_items,order_ Users,merchants,
|     | pricingsnapshot,lifecycle | status_history | products,inventory, |
| --- | ------------------------- | -------------- | ------------------- |
payments,deliveries
Payments Paymentinitiation,verification, payments,payment_ Orders,payment
webhooks,reconciliation,refunds, webhook_events,refunds, adapter,audit
|     | ledger | transactions |     |
| --- | ------ | ------------ | --- |
Riders Riderprofile,documents,verification, riders,rider_documents Users
availabilityandlocation
Deliveries Deliverycreation,dispatch,assignment, deliveries,delivery_ Orders,riders,
status,tracking,proofofdelivery assignments,delivery_ mappingadapter
tracking
Notifications Notificationcreation,preferences, notifications,notification_ Users,messaging
|     | devicetokens,channeldispatch,outbox | preferences,device_tokens, | adapters |
| --- | ----------------------------------- | -------------------------- | -------- |
|     | processing                          | outbox_events              |          |
Administration Privilegedoperations,approvals, audit_logs Allmodulesthrough
| &Audit | reporting,audittrail |     | approvedinterfaces |
| ------ | -------------------- | --- | ------------------ |
Dependencyrules: amodulemaycallanothermoduleonlythroughitsexportedserviceinterface;itnever
writes to a table it does not own. The module list describes the target platform scope; modules may be
deliveredinstages(Section15)withoutchangingtheseboundaries.
Page12of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
6 Database design and relationships
This section defines the complete relational model: every entity, its principal attributes, its keys and
constraints, and every relationship with its cardinality and delete behaviour. Enumerated values are
showninuppercaseandareimplementedasPostgreSQLenumtypes(Prismaenums).
6.1 Modellingconventions
• Primary keys are named id (UUID), except for one-to-one profile tables whose primary key is the
owninguser_idorproduct_id,andforlogtablesthatuseaBIGINTidentity.
• Foreignkeysarenamed<entity>_idandarealwaysdeclared;everyforeignkeycolumnisindexed.
• Tables and columns use snake_case in the database and are mapped to camelCase in the Prisma
client.
• Every mutable table has created_at and updated_at; updated_at is maintained by Prisma or a
trigger.
• Orderitemspreservetheproductname,unitpriceandselectedoptionsatpurchasetime,andorders
preserveasnapshotofthedeliveryaddress,solatereditsneverchangehistory.
• Statuses are enumerations with explicit transition rules enforced in the service layer (Section 8.4,
Section10.3,Section10.4,Section10.5).
6.2 Entitycatalogue
Identityandaccess
Page13of62

| EPADASH-BE-ARCH-001 | Version0.2—Revisedaftertechnicalreview |                    |
| ------------------- | -------------------------------------- | ------------------ |
| Table               | Keyattributes                          | Keysandconstraints |
| Table7. Entities:   | identityandaccess                      |                    |
| Table               | Keyattributes                          | Keysandconstraints |
| roles               | id(smallint),name(CUSTOMER,MERCHANT,   | PKid;nameunique    |
RIDER,ADMIN,SUPER_ADMIN),description
users id,role_id,email(case-insensitive),phone FKrole_id;emailunique;phone
(E.164),password_hash,status(PENDING_ unique;CHECKemailorphone
|     | VERIFICATION,ACTIVE,SUSPENDED, | present;index(role_id,status) |
| --- | ------------------------------ | ----------------------------- |
DISABLED),email_verified_at,phone_verified_
at,failed_login_count,locked_until,last_login_at,
status_reason,deleted_at
sessions id,user_id,family_id,refresh_token_hash,user_ FKuser_id;refresh_token_hash
agent,ip_address,expires_at,revoked_at unique;indexfamily_id;indexuser_id
wherenotrevoked
otp_codes id,user_id,channel(EMAIL,SMS),purpose FKuser_id;index(user_id,purpose,
|     | (VERIFY_EMAIL,VERIFY_PHONE),code_ | created_at) |
| --- | --------------------------------- | ----------- |
hash,attempts,expires_at,consumed_at
password_reset_ id,user_id,token_hash,expires_at,used_at FKuser_id;token_hashunique
tokens
addresses id,user_id,label,recipient_name,phone,line1, FKuser_id;onedefaultperuser
line2,city,region,country_code,latitude, (partialuniqueindex);latitudeand
|     | longitude,delivery_notes,is_default | longituderangechecks |
| --- | ----------------------------------- | -------------------- |
Roleprofiles
| Table8. Entities: | roleprofiles  |                    |
| ----------------- | ------------- | ------------------ |
| Table             | Keyattributes | Keysandconstraints |
customers user_id,first_name,last_name,avatar_url PKandFKuser_id
| admins | user_id,first_name,last_name | PKandFKuser_id |
| ------ | ---------------------------- | -------------- |
riders user_id,first_name,last_name,vehicle_type PKandFKuser_id;partialindex
(BICYCLE,MOTORBIKE,CAR),vehicle_plate, (availability,last_location_at)for
|     | national_id_encrypted,verification_status | approvedriders |
| --- | ----------------------------------------- | -------------- |
(PENDING,APPROVED,REJECTED),verified_
by,verified_at,availability(OFFLINE,
AVAILABLE,BUSY),current_latitude,current_
longitude,last_location_at
Page14of62

| EPADASH-BE-ARCH-001 | Version0.2—Revisedaftertechnicalreview |                    |
| ------------------- | -------------------------------------- | ------------------ |
| Table               | Keyattributes                          | Keysandconstraints |
rider_documents id,rider_id,doc_type(NATIONAL_ID, FKrider_id;FKreviewed_by
DRIVERS_LICENSE,VEHICLE_
REGISTRATION,SELFIE),file_key(private
storage),status,reviewed_by,reviewed_at
Merchants,catalogueandinventory
| Table9. Entities: | merchants,catalogueandinventory |                    |
| ----------------- | ------------------------------- | ------------------ |
| Table             | Keyattributes                   | Keysandconstraints |
categories id,parent_id,type(MERCHANT,PRODUCT), selfFKparent_id;unique(type,slug)
name,slug,image_url,sort_order,is_active
merchants id,owner_user_id,business_name,slug, FKowner_user_id;slugunique;
description,logo_url,cover_image_url,phone, partialindexforpubliclisting;trigram
email,status(PENDING_APPROVAL,ACTIVE, indexonbusiness_name;index
|     | SUSPENDED,CLOSED),is_open,accepts_ | (latitude,longitude) |
| --- | ---------------------------------- | -------------------- |
delivery,accepts_pickup,min_order_amount,
avg_prep_minutes,addressfields,latitude,
longitude,timezone(IANAname),commission_
rate,rating_avg,rating_count,approved_by,
approved_at,deleted_at
|     | merchant_id,user_id | compositePK;FKstomerchantsand |
| --- | ------------------- | ----------------------------- |
merchant_staff
users
| merchant_ | merchant_id,category_id | compositePK;resolvesthe |
| --------- | ----------------------- | ----------------------- |
many-to-manylink
categories
merchant_hours id,merchant_id,day_of_week(0to6,0= unique(merchant_id,day_of_week,
|     | Sunday),opens_at,closes_at | opens_at);aclosingtimeearlierthan |
| --- | -------------------------- | --------------------------------- |
theopeningtimemeanstheperiod
runspastmidnight
delivery_zones id,merchant_id,name,max_distance_km, FKmerchant_id;CHECKmax_
|     | delivery_fee,est_minutes,is_active | distance_km>0 |
| --- | ---------------------------------- | ------------- |
products id,merchant_id,category_id,name,slug, FKsmerchant_id,category_id;unique
description,image_url,sku,price,compare_at_ (merchant_id,slug);CHECKprice>=
price,currency,status(DRAFT,PUBLISHED, 0;partialindexforpubliclisting;
|     | ARCHIVED),is_available,track_inventory,sort_ | trigramindexonname |
| --- | -------------------------------------------- | ------------------ |
order,deleted_at
product_option_ id,product_id,name,min_select,max_select, FKproduct_id;CHECKmax_select
|     | sort_order | >=min_select |
| --- | ---------- | ------------ |
groups
product_options id,group_id,name,price_delta,is_available, FKgroup_id
sort_order
Page15of62

| EPADASH-BE-ARCH-001 | Version0.2—Revisedaftertechnicalreview |                    |
| ------------------- | -------------------------------------- | ------------------ |
| Table               | Keyattributes                          | Keysandconstraints |
inventory_items product_id,quantity_on_hand,quantity_reserved, PKandFKproduct_id;CHECKon_
|     | low_stock_threshold | hand>=0,reserved>=0andreserved |
| --- | ------------------- | ------------------------------ |
<=on_hand
inventory_ id(bigint),product_id,change_qty,reason FKsproduct_id,order_id;
movements (RESTOCK,SALE,RESERVATION,RELEASE, append-only;index(product_id,
|     | ADJUSTMENT,RETURN,WASTE),order_id, | created_at) |
| --- | ---------------------------------- | ----------- |
created_by,note
Orders
| Table10. Entities: | orders        |                    |
| ------------------ | ------------- | ------------------ |
| Table              | Keyattributes | Keysandconstraints |
orders id,order_number,customer_id,merchant_id, FKscustomer_id,merchant_id,
status(PENDING_PAYMENT,PLACED, delivery_address_id;order_number
|     | ACCEPTED,PREPARING,READY_FOR_  | unique;unique(customer_id,     |
| --- | ------------------------------ | ------------------------------ |
|     | PICKUP,OUT_FOR_DELIVERY,       | idempotency_key);CHECKdelivery |
|     | COMPLETED,CANCELLED,REJECTED), | orderscarryanaddress;indexes   |
fulfilment(DELIVERY,PICKUP),payment_ (customer_id,created_at),(merchant_
method(CARD,MOBILE_MONEY,BANK_ id,status,created_at),(status,created_
|     | TRANSFER,CASH_ON_DELIVERY), | at) |
| --- | --------------------------- | --- |
payment_status,delivery_address_id,delivery_
address(JSONBsnapshot),deliverylatitudeand
longitude,currency,subtotal,delivery_fee,
service_fee,discount_total,tax_total,total,
customer_note,cancellation_reason,cancelled_
by,idempotency_key,expires_at,placed_at,
accepted_at,ready_at,completed_at,cancelled_at
order_items id,order_id,product_id,product_name,unit_ FKsorder_id,product_id;CHECK
|     | price,quantity,selected_options(JSONB),line_ | quantity>0 |
| --- | -------------------------------------------- | ---------- |
total,note
order_status_ id(bigint),order_id,from_status,to_status, FKorder_id;append-only;index
| history | changed_by,note,created_at | (order_id,created_at) |
| ------- | -------------------------- | --------------------- |
Paymentsandmoney
Page16of62

| EPADASH-BE-ARCH-001 | Version0.2—Revisedaftertechnicalreview |                    |
| ------------------- | -------------------------------------- | ------------------ |
| Table11. Entities:  | paymentsandmoney                       |                    |
| Table               | Keyattributes                          | Keysandconstraints |
payments id,order_id,provider,provider_reference, FKorder_id;provider_reference
method,amount,currency,status(PENDING, unique;idempotency_keyunique;
|     | SUCCESS,FAILED,CANCELLED,     | partialuniqueindexallowingone |
| --- | ----------------------------- | ----------------------------- |
|     | REFUNDED,PARTIALLY_REFUNDED), | SUCCESSpaymentperorder        |
idempotency_key,gateway_response(sanitised
JSONB),failure_reason,paid_at
payment_ id(bigint),provider,event_id,event_type, unique(provider,event_id)for
webhook_events payload(JSONB),processed_at idempotentprocessing
refunds id,payment_id,amount,reason,status FKpayment_id;CHECKamount>0
(PENDING,SUCCESS,FAILED),provider_
reference,requested_by
transactions id,reference,type(CHARGE,REFUND, referenceunique;immutableledger
|     | PLATFORM_FEE,MERCHANT_PAYOUT, | (UPDATEandDELETEblockedby |
| --- | ----------------------------- | ------------------------- |
|     | RIDER_PAYOUT,COD_COLLECTION), | trigger)                  |
direction(CREDIT,DEBIT),amount,currency,
status,order_id,payment_id,refund_id,
merchant_id,rider_id
Delivery
| Table12. Entities: | delivery      |                    |
| ------------------ | ------------- | ------------------ |
| Table              | Keyattributes | Keysandconstraints |
deliveries id,order_id,rider_id,status(UNASSIGNED, order_idunique;FKrider_id(null
|     | ASSIGNED,AT_PICKUP,PICKED_UP, | untilassigned);CHECKarideris |
| --- | ----------------------------- | ---------------------------- |
DELIVERED,FAILED,CANCELLED),pickup presentonceassigned;indexes(rider_
anddrop-offcoordinates,distance_km,est_ id,status)andunassignedbyage
minutes,delivery_fee,rider_earning,
confirmation_code_hash,confirmation_attempts,
proof_photo_url,failure_reason,assigned_at,
picked_up_at,delivered_at
delivery_ id,delivery_id,rider_id,status(OFFERED, FKsdelivery_id,rider_id;partial
assignments ACCEPTED,REJECTED,EXPIRED, uniqueindexallowingoneOFFERED
|     | CANCELLED),offered_at,expires_at, | rowperdelivery |
| --- | --------------------------------- | -------------- |
responded_at,reason
delivery_ id(bigint),delivery_id,rider_id,latitude, FKdelivery_id;index(delivery_id,
tracking longitude,heading,speed_kmh,accuracy_m, recorded_atdescending)
recorded_at
Page17of62

| EPADASH-BE-ARCH-001 | Version0.2—Revisedaftertechnicalreview |     |
| ------------------- | -------------------------------------- | --- |
Notifications,messagingandaudit
| Table13. Entities: | notifications,messagingandaudit |                    |
| ------------------ | ------------------------------- | ------------------ |
| Table              | Keyattributes                   | Keysandconstraints |
notifications id,user_id,channel(IN_APP,PUSH,SMS, FKuser_id;index(user_id,created_
EMAIL),type,title,body,data(JSONBdeep-link at);partialindexonunreadin-app
|     | payload),status(PENDING,SENT,FAILED), | items |
| --- | ------------------------------------- | ----- |
attempts,sent_at,read_at,error
notification_ user_id,channel,category(ORDERS, compositePK(user_id,channel,
| preferences | PROMOTIONS,ACCOUNT),enabled | category) |
| ----------- | --------------------------- | --------- |
device_tokens id,user_id,token,platform(ANDROID,IOS, tokenunique;FKuser_id
WEB),last_used_at
id(bigint),actor_user_id,actor_role,action, FKactor_user_id;append-only;
audit_logs
entity_type,entity_id,old_values,new_values, indexes(entity_type,entity_id),
|     | ip_address,user_agent,created_at | (actor_user_id,created_at) |
| --- | -------------------------------- | -------------------------- |
id(bigint),event_type,aggregate_type, partialindexonPENDINGrowsfor
outbox_events
|     | aggregate_id,payload(JSONB),status | theworker |
| --- | ---------------------------------- | --------- |
(PENDING,PROCESSED,FAILED),attempts,
created_at,processed_at
Page18of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
| Relationship(parenttochild) | Cardinality | Foreignkey | Ondelete |
| --------------------------- | ----------- | ---------- | -------- |
6.3 Relationshipsanddeletebehaviour
Table14. Relationshipmatrix
| Relationship(parenttochild) | Cardinality | Foreignkey    | Ondelete |
| --------------------------- | ----------- | ------------- | -------- |
| rolestousers                | 1: N        | users.role_id | RESTRICT |
| userstosessions,otp_codes,  | 1: N        | user_id       | CASCADE  |
password_reset_tokens
| userstoaddresses         | 1: N | addresses.user_id | CASCADE |
| ------------------------ | ---- | ----------------- | ------- |
| userstocustomers,riders, | 1: 1 | user_id(alsoPK)   | CASCADE |
admins
userstomerchants(owner) 1: N merchants.owner_user_id RESTRICT
merchantstousers(staff) N:M merchant_staff(merchant_id,user_ CASCADE
id)
merchantstocategories N:M merchant_categories(merchant_id, CASCADE
category_id)
categoriestocategories(parent) 1: N categories.parent_id SETNULL
| merchantstomerchant_hours, | 1: N | merchant_id | CASCADE |
| -------------------------- | ---- | ----------- | ------- |
delivery_zones
merchantstoproducts 1: N products.merchant_id CASCADE(softdelete
inpractice)
| categoriestoproducts      | 1: N | products.category_id | SETNULL |
| ------------------------- | ---- | -------------------- | ------- |
| productstoproduct_option_ | 1: N | product_id           | CASCADE |
groups
| product_option_groupsto | 1: N | group_id | CASCADE |
| ----------------------- | ---- | -------- | ------- |
product_options
productstoinventory_items 1: 0..1 inventory_items.product_id CASCADE
| productstoinventory_ | 1: N | product_id | CASCADE |
| -------------------- | ---- | ---------- | ------- |
movements
| customerstoorders | 1: N | orders.customer_id | RESTRICT |
| ----------------- | ---- | ------------------ | -------- |
| merchantstoorders | 1: N | orders.merchant_id | RESTRICT |
addressestoorders 1: N orders.delivery_address_id SETNULL(snapshot
retained)
| orderstoorder_items | 1: N(at | order_items.order_id | CASCADE |
| ------------------- | ------- | -------------------- | ------- |
least1)
Page19of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
| Relationship(parenttochild) | Cardinality | Foreignkey | Ondelete |
| --------------------------- | ----------- | ---------- | -------- |
productstoorder_items 1: N order_items.product_id SETNULL(snapshot
retained)
| orderstoorder_status_history | 1: N | order_id           | CASCADE  |
| ---------------------------- | ---- | ------------------ | -------- |
| orderstopayments             | 1: N | payments.order_id  | RESTRICT |
| paymentstorefunds            | 1: N | refunds.payment_id | RESTRICT |
orders,payments,refunds, 1: Neach optionalforeignkeysontransactions RESTRICT
merchants,ridersto
transactions
| orderstodeliveries | 1: 0..1 | deliveries.order_id | CASCADE |
| ------------------ | ------- | ------------------- | ------- |
riderstodeliveries 1: N deliveries.rider_id(nulluntil RESTRICT
assigned)
| deliveriestodelivery_ | 1: N | delivery_id | CASCADE |
| --------------------- | ---- | ----------- | ------- |
assignments
| riderstodelivery_assignments  | 1: N | rider_id    | RESTRICT |
| ----------------------------- | ---- | ----------- | -------- |
| deliveriestodelivery_tracking | 1: N | delivery_id | CASCADE  |
| riderstorider_documents       | 1: N | rider_id    | CASCADE  |
| userstonotifications,         | 1: N | user_id     | CASCADE  |
notification_preferences,
device_tokens
| userstoaudit_logs(actor) | 1: N | actor_user_id | RESTRICT |
| ------------------------ | ---- | ------------- | -------- |
Financial,orderandauditrecordsuseRESTRICTorSETNULLsotheycanneverberemovedbydeleting
aparent;users,merchantsandproductsaresoft-deleted.
6.4 Entityrelationshipdiagrams
Figure3,Figure4andFigure5showtheentitiesandthecardinalitiesoftherelationshipmatrix. Dashed
boxes are entities shown for context. Link tables, lookup details and log tables are described in Sec-
tion6.2.
6.5 Integrityandconcurrencyrules
1. Anaccountmusthaveanemailaddressoraphonenumber,andbothareuniquewhenpresent.
2. Prices,fees,totalsandquantitiescannotbenegative;anorderitemquantitymustbeatleast1.
3. Stockonhandandreservedstockcannotbecomenegativeandreservedstockcannotexceedstockon
hand. Reservations use a conditional update (UPDATE ... SET quantity_reserved = quantity_
reserved + n WHERE quantity_on_hand - quantity_reserved >= n)andfailwhennorowisup-
dated,sotwocustomerscannotbuythelastitem.
Page20of62

| EPADASH-BE-ARCH-001 |     |     |     |     | Version0.2—Revisedaftertechnicalreview |     |     |
| ------------------- | --- | --- | --- | --- | -------------------------------------- | --- | --- |
notifications
1:N
|     | roles |     | 1:N | users | 1:N | audit_logs |     |
| --- | ----- | --- | --- | ----- | --- | ---------- | --- |
1:N(owner)
|     |           |     | 1:1 |           | 1:1 |        |     |
| --- | --------- | --- | --- | --------- | --- | ------ | --- |
|     | customers |     |     | merchants |     | riders |     |
|     | N:M       |     | 1:N |           | 1:N | 1:N    |     |
categories
|     |     |     | merchant_hours |     | delivery_zones |     | products |
| --- | --- | --- | -------------- | --- | -------------- | --- | -------- |
(typeMERCHANT)
|     |     |     |     |     |     | 1:0..1 | N:1 |
| --- | --- | --- | --- | --- | --- | ------ | --- |
categories
inventory_items
(typePRODUCT)
Figure3. Entityrelationships: identity,merchantsandcatalogue. Linktables,optiongroupsandstaffrecordsare
describedintheentitycatalogue.
|     | customers |     |     |     |     | merchants |     |
| --- | --------- | --- | --- | --- | --- | --------- | --- |
|     |           | 1:N |     |     | 1:N |           |     |
orders
|             | 1:N |                      | 1:N |     | 1:N 1:0..1 |     |            |
| ----------- | --- | -------------------- | --- | --- | ---------- | --- | ---------- |
| order_items |     | order_status_history |     |     | payments   |     | deliveries |
1:N
products
Figure4.
| Entityrelationships: |     | ordersandorderitems. |     |     |     |     |     |
| -------------------- | --- | -------------------- | --- | --- | --- | --- | --- |
Page21of62

| EPADASH-BE-ARCH-001 |        | Version0.2—Revisedaftertechnicalreview |     |        |
| ------------------- | ------ | -------------------------------------- | --- | ------ |
|                     | orders |                                        |     | riders |
1:N
|     | 1:N | 1:0..1 |     |     |
| --- | --- | ------ | --- | --- |
payments deliveries
| 1:N     | 1:N          |                      | 1:N | 1:N               |
| ------- | ------------ | -------------------- | --- | ----------------- |
| refunds | transactions | delivery_assignments |     | delivery_tracking |
Figure5. Entityrelationships: payments,ledgeranddelivery. Theledgeralsoreferencesorders,merchantsand
riders,andwebhookeventsarematchedtopaymentsbyproviderreference.
4. An order can have only one successful payment (partial unique index), only one delivery (unique
order_id)andadeliverycanhaveonlyoneopenrideroffer(partialuniqueindex).
5. Duplicatecheckouts,paymentinitiationsandwebhooksarerejectedorreplayedthroughuniqueidem-
potencykeysandeventidentifiers.
6. Deliveryassignmentlocksthedeliveryrow(SELECT ... FOR UPDATE)sothatexactlyoneridercan
winanoffer,andqueueconsumersclaimworkwithFOR UPDATE SKIP LOCKED.
7. Order, payment and delivery status changes are made only through service methods that check the
currentstatusinsidethetransaction(compare-and-set),writeahistoryrowandwriteanoutboxevent.
8. Thetransactionsledgerandaudit_logsareappend-only;triggersrejectUPDATEandDELETE.
9. Ordercreation,paymentconfirmationanddeliverycompletionareeachasingledatabasetransaction;
partialresultsarenevercommitted.
10. Public queries always apply the visibility predicate of Section 10.1; no public query reads the base
tableswithoutit.
6.6 Indexingstrategy
Page22of62

| EPADASH-BE-ARCH-001 |       | Version0.2—Revisedaftertechnicalreview |
| ------------------- | ----- | -------------------------------------- |
| Table               | Index | Purpose                                |
Table15. Principalindexes
| Table | Index | Purpose |
| ----- | ----- | ------- |
merchants partial(city,is_open,rating_avg)where Publicmerchantlistingandsorting
ACTIVEandnotdeleted
merchants GINtrigramonbusiness_name;(latitude, Namesearch;bounding-boxdistance
|     | longitude) | filter |
| --- | ---------- | ------ |
products partial(merchant_id,category_id,sort_ Publiccataloguebymerchantand
|     | order)wherePUBLISHED,availableandnot | category |
| --- | ------------------------------------ | -------- |
deleted
| products | GINtrigramonname | Productsearch |
| -------- | ---------------- | ------------- |
orders (customer_id,created_atdesc);(merchant_id, Customerhistory,merchantqueue,
status,created_atdesc);(status,created_at) administratordashboardsandtimeout
jobs
order_items order_id;product_id Orderdetail;productsalesqueries
payments order_id;(status,created_at);unique Paymentlookup;reconciliationof
|     | provider_reference | pendingpayments |
| --- | ------------------ | --------------- |
transactions order_id;(merchant_id,created_at);(rider_ Settlementandearningsreports
id,created_at)
deliveries (rider_id,status);partialcreated_atwhere Riderworkload;dispatchretryqueue
UNASSIGNED
delivery_ partialrider_idwhereOFFERED;(delivery_ Openoffersperrider;offerhistory
| assignments | id,offered_atdesc) |     |
| ----------- | ------------------ | --- |
delivery_tracking (delivery_id,recorded_atdesc) Latestlocationandtrail
riders partial(availability,last_location_at)where Dispatchcandidatesearch
APPROVED
sessions (user_id)wherenotrevoked;family_id; Sessionlist,reusedetection,expiry
|     | expires_at | clean-up |
| --- | ---------- | -------- |
notifications (user_id,created_atdesc);partialpending; Inbox,workerqueue,unreadbadge
partialunreadin-app
audit_logs (entity_type,entity_id,created_at);(actor_ Auditsearch
user_id,created_at)
6.7 Migrations,seeddataanddatalifecycle
• Migrations: one Prisma migration per change, reviewed in pull requests, applied automatically in
CIandbyacontrolledreleasestepinstagingandproduction. Hand-writtenSQLforpartialindexes,
Page23of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
CHECKconstraints,trigramindexesandimmutabilitytriggerslivesinthesamemigration.
• Referenceseed: roles,merchantandproductcategoriesandconfigurationdefaults;idempotentand
runineveryenvironment.
• Developmentseed: sampleusersforeveryrole,merchants(includingapendingmerchant),products
(includingadraftandasold-outproduct)andstocklevels,sodiscoveryvisibilityrulescanbetested.
Neverruninproduction.
• Retention defaults (configurable): expired sessions, OTP codes and reset tokens purged daily af-
ter seven days; rider location points older than 90 days deleted or aggregated; processed webhook
eventsandoutboxrowsarchivedafter12months;orders,payments,ledgerandauditrecordsretained
accordingtotheorganisation’sfinancialandlegalpolicy.
7 Roles and access control
7.1 Roles
Table16. Userrolesandintendedaccess
Role Intendedaccess
Customer Manageownprofileandaddresses;browsepublicactivemerchantsandpublishedproducts;
create,payfor,viewandcancel(whilepermitted)ownorders;trackowndeliveries;manage
ownnotificationsettings
Merchant Manageownmerchantprofile,hours,deliveryzonesandopenstatus;manageowncatalogue
andinventory;viewandprocessordersbelongingtothatmerchant;viewownsettlement
information. Staffaccountsactwithinonemerchantonly
Rider Manageownprofile,documentsandavailability;sendlocationupdates;viewandrespondto
owndeliveryoffers;updatemilestonesonassigneddeliveries;viewownearnings
Administrator Approve,suspendandmanageusers,merchantsandriders;viewallorders,paymentsand
deliveries;reassigndeliveries;processrefunds;managecategoriesandplatformconfiguration;
viewreportsandauditlogs. SUPER_ADMINadditionallycreatesadministratorsandchanges
platformconfiguration
7.2 Permissionmatrix
Page24of62

| EPADASH-BE-ARCH-001 |          | Version0.2—Revisedaftertechnicalreview |       |       |
| ------------------- | -------- | -------------------------------------- | ----- | ----- |
| Resourceandaction   | Customer | Merchant                               | Rider | Admin |
Table17. Permissionmatrix(own=onlyresourcesbelongingtotheprincipal)
| Resourceandaction                 | Customer | Merchant | Rider | Admin |
| --------------------------------- | -------- | -------- | ----- | ----- |
| Browseactivemerchantsandpublished | Yes      | Yes      | Yes   | Yes   |
products
| Viewandeditownprofileandpassword      | Own | Own | Own | Own |
| ------------------------------------- | --- | --- | --- | --- |
| Managesavedaddresses                  | Own | No  | No  | No  |
| Createandmanagemerchantprofile,hours, | No  | Own | No  | Any |
zones
| Approve,suspendorcloseamerchant       | No       | No          | No           | Yes |
| ------------------------------------- | -------- | ----------- | ------------ | --- |
| Create,edit,publishandarchiveproducts | No       | Own         | No           | Any |
| Adjustinventory                       | No       | Own         | No           | Any |
| Createanorderandrequestaquote         | Yes      | No          | No           | No  |
| Vieworders                            | Own      | Ownmerchant | Assignedonly | Any |
| Cancelanorderbeforeitisaccepted       | Own      | No          | No           | Any |
| Accept,reject,prepare,markready       | No       | Ownmerchant | No           | Any |
| Initiatepayment                       | Ownorder | No          | No           | No  |
| Viewpaymentstatus                     | Own      | Ownmerchant | No           | Any |
(summary)
| Issuearefund                        | No  | No          | No           | Yes    |
| ----------------------------------- | --- | ----------- | ------------ | ------ |
| Setavailabilityandsendlocation      | No  | No          | Own          | No     |
| Acceptorrejectadeliveryoffer        | No  | No          | Own          | No     |
| Updatedeliverymilestones            | No  | No          | Assignedonly | Any    |
| Assignorreassignarider              | No  | No          | No           | Yes    |
| Approveorrejectarider               | No  | No          | No           | Yes    |
| Viewownnotificationsandpreferences  | Own | Own         | Own          | Own    |
| Suspendorreactivateauser            | No  | No          | No           | Yes    |
| Createadministrators;changeplatform | No  | No          | No           | SUPER_ |
| settings                            |     |             |              | ADMIN  |
| Viewreportsandauditlogs             | No  | Ownmerchant | Own          | Yes    |
|                                     |     | (reports)   | (earnings)   |        |
Page25of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
7.3 Authorisationrules
• Denybydefault;explicitlygrantonlythepermissionsrequired.
• Authenticationprovesidentity;authorisationdecideswhethertheidentitymayperformtherequested
action.
• Enforcepermissionsontheserverforeveryprotectedendpointthroughamiddlewarechain: authen-
ticate,checkaccountstatus,checkrole,thenenforceresourceownership.
• Enforce resource ownership and tenant boundaries in addition to role checks. A merchant must
not access another merchant’s private resources; a customer must not access another customer’s
order; a rider must not update another rider’s assignment. Ownership is enforced by repositories
that scope every query by the authenticated principal (for example merchant_id IN (merchants
of this user)),soanunauthorisedidentifierreturnsnotfound.
• Nevertrustarole,userID,merchantIDorownershipclaimsuppliedonlyinarequestbody;derive
identityfromtheauthenticatedprincipalandverifyresourcerelationships.
• Administrative privileges are narrowly defined, and every administrative change records the actor,
thereasonandthetimeintheauditlog.
8 Authentication and account security
8.1 Authenticationmodel
The system uses short-lived signed access tokens and rotating refresh tokens. For browser clients the
tokens are delivered in Secure, HttpOnly, SameSite cookies with CSRF protection on state-changing
requests; native and mobile clients send the access token in the Authorization header and keep the
refreshtokenintheplatform’ssecurestorage.
Table18. Authenticationparameters
Parameter Specification
Accesstoken SignedJWT(HS256,secretfromthesecretstore),lifetime15minutes;claims
sub(userID),role,sid(sessionID)andjti
Refreshtoken Opaque256-bitrandomvalue,lifetime30days,rotatedoneveryuse;onlyits
SHA-256hashisstoredinsessions
Reusedetection Presentingarefreshtokenthatwasalreadyrotatedrevokesthewholetokenfamily
(family_id)andendsthesession
Sessionlimit Atmost10activesessionsperuser;theoldestisrevokedwhenexceeded
Passwordhashing Argon2idwithmemorycostofatleast19MiB,timecost2andparallelism1,
tunedtothedeploymenthardware
Passwordpolicy Minimum8andmaximum128characters;checkagainstalistofcommonand
breachedpasswords;nocompositionrules
Page26of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
Parameter Specification
Loginprotection 5consecutivefailureslocktheaccountfor15minutes(locked_until);additional
IPandidentifierratelimits(Table22)
Verificationcode 6digits,validfor10minutes,atmost5attempts,60secondresendinterval;
storedhashed
Passwordresettoken 256-bitrandomvalue,validfor30minutes,singleuse,storedhashed
Transport HTTPSonlyoutsidelocaldevelopment;HSTSenabled
8.2 Requiredflows
1. Registration: validate fields, normalise login identifiers, hash the password with Argon2id, cre-
ate the account in PENDING_VERIFICATION status and send a verification code. Customers become
ACTIVE after verification; merchant and rider accounts additionally require administrator approval
(Section8.4).
2. Login: verifycredentials,checkaccountstatus,issueanaccesstokenandarefreshtokenwithanew
sessionrecord,andrecordthesecurity-relevantevent(Figure6).
3. Logout: revoketherefreshtokenandsession;theaccesstoken’sjtiisrejecteduntilitexpires.
4. Refresh: rotatetherefreshtoken,detectreuseandrevokethecompromisedtokenfamilyandsession
(Figure7).
5. Password recovery: return a non-enumerating response; send a single-use, expiring reset token
throughtheconfiguredchannel(Figure8).
6. Password reset: validate the token, enforce the password policy, update the password hash and
revokeallexistingsessionsandrefreshtokens.
7. Accountactivationandsuspension: enforcestatuschecksatauthenticationandonprotectedoper-
ations;recordtheactor,reasonandtimeofadministrativechanges.
8.3 Passwordandcredentialhandling
• Storeonlypasswordhashes,neverplaintextorreversiblepasswords.
• UseArgon2idwithparametersreviewedagainstdeploymentresourcesandcurrentsecurityguidance.
• Storesecretsinenvironmentorsecretmanagement,neverinsourcecontrol.
• Do not log passwords, access tokens, refresh tokens, reset tokens, payment secrets or full sensitive
payloads.
• Apply rate limits and abuse controls to login, registration, password recovery and verification end-
points.
• UseTLSforallnon-localtraﬀic.
• Returnthesameresponseandsimilartimingforexistingandnon-existingaccountsonloginfailure
andpasswordrecovery.
Page27of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
Loginrequest
Validateinputandnormalise
theloginidentifier
No Rejectwithagenericerror
Credentialsvalid?
(noaccountenumeration)
Yes
Accountstatuspermits No Reject;suspendedordisabled
authentication? accountscannotauthenticate
Yes
Issueaccesscredential
andrefresh/sessionrecord
Recordsecurity-relevantevent
Returncredentialstoclient
Figure6. Loginflow.
Refreshrequest(refresh
tokenpresented)
Tokenvalid,unexpired No Previouslyusedtoken No
Rejectrequest
andnotrevoked? (reusedetected)?
Yes Yes
Rotate: revokethepresentedtoken Revokethecompromisedtoken
andissueanewrefreshtoken family/session;rejectrequest
Issuenewaccesscredential
Reusedetectionapplies
wheresupported.
Returnnewcredentials
Figure7. Refresh-tokenrotationandreusedetection.
Page28of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
Messaging
Client API Database
provider
Forgot-passwordrequest
(loginidentifier)
Createsingle-use,
expiringresettoken
Sendresettokenthroughtheconfiguredchannel
Non-enumeratingresponse
Resetrequest
(token,newpassword)
Validatetokenandpasswordpolicy;
updatepasswordhash
Revokeexistingsessions/
refreshtokensasrequired
Result
Figure8. Passwordrecoveryandresetsequence.
8.4 Accountandapprovalstatuses
Table19. Accountstatustransitions
From To Trigger
(new) PENDING_ Registrationcompleted
VERIFICATION
PENDING_ ACTIVE Verificationcodeconfirmed(customers);verificationand
VERIFICATION administratorapproval(merchantsandriders)
ACTIVE SUSPENDED Administratoractionwithareason;allsessionsare
revoked
SUSPENDED ACTIVE Administratorreactivation
ACTIVEorSUSPENDED DISABLED Administratoractionoraccountclosurerequest;sessions
revoked;dataretainedperpolicy
DISABLED ACTIVE Administratorreactivationonly
Suspended and disabled accounts must not authenticate or perform protected actions. Public visibility
additionallydependsontheentity-specificstatus: amerchantislistedonlywhenmerchants.statusis
ACTIVE(theothervaluesarePENDING_APPROVAL,SUSPENDEDandCLOSED),andariderreceivesoffersonly
whenriders.verification_statusisAPPROVED.
Page29of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
9 API requirements and conventions
9.1 Generalconventions
Table20. APIconventions
Topic Rule
Basepath /api/v1;abreakingchangecreatesanewversionpath
Format JSONrequestandresponsebodies,UTF-8,Content-Type: application/json
Naming camelCasefields,kebab-casepaths,pluralnounsforcollections,standardHTTP
methods
Authentication Authorization: Bearer <accessToken>(orsessioncookieforbrowsers)onevery
endpointexceptthosemarkedPublic
Identifiersanddates UUIDstrings;ISO8601timestampsinUTC
Money JSONnumbersinmajorunitswithtwodecimalsplusacurrencycode. Theclient
neversendspricesortotals;theservercalculatesthem
Pagination pageandlimitqueryparameters(default20,maximum100)withmeta.page,
meta.limit,meta.totalandmeta.totalPages;cursorpaginationisusedfor
high-volumelistssuchasnotificationsandtracking
Sortingandfiltering sort=fieldorsort=-field(descending)anddocumentedfiltersperendpoint;
unknownparametersarerejected
Validation Everypath,queryandbodyparameterisvalidatedwithZod;failuresreturn
VALIDATION_ERRORwithfield-leveldetails
Idempotency Idempotency-KeyheaderrequiredonPOST /ordersandPOST /orders/{id}/
payments;arepeatedkeywiththesamebodyreturnstheoriginalresult,witha
differentbodyreturnsIDEMPOTENCY_CONFLICT
Documentation OpenAPI3.1generatedfromtheZodschemasandservedthroughSwaggerUI;
contracttestsverifythatimplementedendpointsmatchthespecification
Models Internaldatabasemodelsareneverexposeddirectly;responsesuseexplicitresponse
schemas
9.2 Commonresponseshape
Page30of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
Success:
{
| "data":      | {},          |     |     |
| ------------ | ------------ | --- | --- |
| "meta":      | {            |     |     |
| "requestId": | "request-id" |     |     |
}
}
Paginatedlistsaddpage,limit,totalandtotalPagestometa. Error:
{
| "error":   | {                   |           |                 |
| ---------- | ------------------- | --------- | --------------- |
| "code":    | "VALIDATION_ERROR", |           |                 |
| "message": | "The request        | could not | be processed.", |
"details": [{ "field": "email", "message": "Must be a valid email address"
}],
| "requestId": | "request-id" |     |     |
| ------------ | ------------ | --- | --- |
}
}
9.3 Errorcodes
Table21. Errorcodes
| HTTP | Code        |     | When                      |
| ---- | ----------- | --- | ------------------------- |
| 400  | BAD_REQUEST |     | MalformedJSONorparameters |
401 UNAUTHENTICATED,TOKEN_ Missing,invalidorexpiredcredentials;theclientrefreshes
|     | EXPIRED                    |     | once                                |
| --- | -------------------------- | --- | ----------------------------------- |
| 402 | PAYMENT_FAILED             |     | Gatewaydeclinedorverificationfailed |
| 403 | FORBIDDEN,ACCOUNT_PENDING, |     | Roleorstatuscheckfailed             |
ACCOUNT_SUSPENDED
| 404 | NOT_FOUND |     | Resourcemissing,ornotvisibletothisprincipal   |
| --- | --------- | --- | --------------------------------------------- |
| 409 | CONFLICT  |     | Duplicateresourcesuchasanexistingemailaddress |
409 INVALID_STATE_TRANSITION Statuschangenotallowedfromthecurrentstatus
| 409 | OUT_OF_STOCK,MERCHANT_ |     | Ordercannotbefulfilledasrequested |
| --- | ---------------------- | --- | --------------------------------- |
CLOSED,PRODUCT_UNAVAILABLE
409 IDEMPOTENCY_CONFLICT Idempotencykeyreusedwithadifferentbody
422 VALIDATION_ERROR,BELOW_ Fieldvalidationorbusinessrulefailed
MIN_ORDER,OUTSIDE_
DELIVERY_AREA
| 429 | RATE_LIMITED |     | Toomanyrequests;Retry-Afterheaderisreturned |
| --- | ------------ | --- | ------------------------------------------- |
500 INTERNAL_ERROR Unexpectedfailure;nointernaldetailsareexposed
Page31of62

| EPADASH-BE-ARCH-001 |     | Version0.2—Revisedaftertechnicalreview |     |
| ------------------- | --- | -------------------------------------- | --- |
9.4 Ratelimits
Table22. Defaultratelimits
| Endpointgroup | Limit          |     | Key             |
| ------------- | -------------- | --- | --------------- |
| Login         | 10per15minutes |     | IPandidentifier |
Registration,verificationresend,password 5perhour IPandidentifier
recovery
| Publicdiscovery        | 120perminute                 |     | IP       |
| ---------------------- | ---------------------------- | --- | -------- |
| Authenticatedendpoints | 300perminute                 |     | User     |
| Riderlocationupdates   | 30perminute                  |     | User     |
| Paymentwebhooks        | Notlimited;signaturerequired |     | Provider |
9.5 Endpointcatalogue
Thetablesbelowlisteveryendpointofthefirstrelease. Accesscodes: Ppublic,Ccustomer,Mmerchant
| (ownerorstaff),Rrider,Aadministrator. | Pathsarerelativeto/api/v1. |     |     |
| ------------------------------------- | -------------------------- | --- | --- |
Table23. Authenticationendpoints
| Methodandpath                  | Access | Purpose                                |     |
| ------------------------------ | ------ | -------------------------------------- | --- |
| POST /auth/register            | P      | Createacustomer,merchantorrideraccount |     |
| POST /auth/verify              | P      | Confirmtheemailorphoneverificationcode |     |
| POST /auth/resend-verification | P      | Sendanewcode(ratelimited)              |     |
POST /auth/login P Exchangecredentialsforaccessandrefreshtokens
POST /auth/refresh P Rotatetherefreshtokenandobtainanewaccess
token
| POST /auth/logout | Any | Revokethecurrentsession |     |
| ----------------- | --- | ----------------------- | --- |
POST /auth/forgot-password P Startpasswordrecovery(alwaysreturns200)
|     | P   | Setanewpasswordwithavalidtoken;revokesall |     |
| --- | --- | ----------------------------------------- | --- |
POST /auth/reset-password
sessions
POST /auth/change-password Any Changepasswordusingthecurrentpassword
| GET /auth/sessions                | Any | Listownactivesessions |     |
| --------------------------------- | --- | --------------------- | --- |
| DELETE /auth/sessions/{sessionId} | Any | Revokeonesession      |     |
Page32of62

| EPADASH-BE-ARCH-001 |     | Version0.2—Revisedaftertechnicalreview |     |
| ------------------- | --- | -------------------------------------- | --- |
Table24. Userandprofileendpoints
| Methodandpath | Access | Purpose |     |
| ------------- | ------ | ------- | --- |
GET /users/me,PATCH /users/me Any Readandupdateownaccountandroleprofile
|     | C   | Listsavedaddresses |     |
| --- | --- | ------------------ | --- |
GET /users/me/addresses
| POST /users/me/addresses | C   | Addanaddress(geocodedonsave) |     |
| ------------------------ | --- | ---------------------------- | --- |
PATCH /users/me/addresses/ C Updateorremoveanaddress;setdefault
{addressId},DELETE ...
| POST /users/me/device-tokens | Any | Registerapushtoken |     |
| ---------------------------- | --- | ------------------ | --- |
|                              | Any | Removeapushtoken   |     |
DELETE /users/me/device-tokens/
{token}
POST /uploads/presign Any ObtainapresigneduploadURLforanimageor
document
GET /admin/users,GET /admin/users/ A Searchandviewusers(filters: role,status,q)
{userId}
PATCH /admin/users/{userId}/ A Activate,suspendordisablewithareason
status
| POST /admin/admins | SUPER_ | Createanadministratoraccount |     |
| ------------------ | ------ | ---------------------------- | --- |
ADMIN
Table25. Merchantdiscoveryandcatalogueendpoints(public)
| Methodandpath | Access | Purpose |     |
| ------------- | ------ | ------- | --- |
GET /categories?type=MERCHANTor P Activecategoriesinsortorder
type=PRODUCT
| GET /merchants | P   | Listandsearchactivemerchants. | Filters: q, |
| -------------- | --- | ----------------------------- | ----------- |
categoryId,city,isOpen,deliversTo
(coordinates);latandlngenablesort=distance;
othersorts: rating,name
GET /merchants/{idOrSlug} P Merchantprofile,hours,deliveryzonesand
open-nowflag
GET /merchants/{merchantId}/ P Publishedproductsofamerchant. Filters:
| products |     | categoryId,q;paginated |     |
| -------- | --- | ---------------------- | --- |
GET /products P Searchpublishedproductsacrossactivemerchants.
Filters: q,categoryId,merchantId
GET /products/{productId} P Productdetailwithoptiongroups,priceand
availability
Page33of62

| EPADASH-BE-ARCH-001 |     |     | Version0.2—Revisedaftertechnicalreview |
| ------------------- | --- | --- | -------------------------------------- |
Table26. Merchantmanagementendpoints
| Methodandpath   |     | Access | Purpose                                   |
| --------------- | --- | ------ | ----------------------------------------- |
| POST /merchants |     | M      | Submitamerchantapplication(statusPENDING_ |
APPROVAL)
GET /merchant/profile,PATCH / M Readandupdateownmerchantprofile
merchant/profile
|     |     | M   | Openorclosetheshop(isOpen) |
| --- | --- | --- | -------------------------- |
PATCH /merchant/status
| PUT /merchant/hours |     | M   | Replacetheweeklyopeninghours |
| ------------------- | --- | --- | ---------------------------- |
GET/POST /merchant/delivery-zones M Listandcreatedeliveryzones
| PATCH/DELETE | /merchant/ | M   | Updateorremoveazone |
| ------------ | ---------- | --- | ------------------- |
delivery-zones/{zoneId}
|          | /merchant/staff,DELETE | M(owner) | Managestaffaccounts |
| -------- | ---------------------- | -------- | ------------------- |
| GET/POST |                        | /        |                     |
merchant/staff/{userId}
GET/POST /merchant/products M List(includingdrafts)andcreateproducts
GET/PATCH/DELETE /merchant/ M Read,updateandsoft-deleteaproduct
products/{productId}
PATCH /merchant/products/ M Publish,unpublish(DRAFT)orarchive
{productId}/status
| PATCH /merchant/products/ |     | M   | Sold-outswitch |
| ------------------------- | --- | --- | -------------- |
{productId}/availability
| PUT /merchant/products/ |     | M   | Replaceoptiongroupsandoptions |
| ----------------------- | --- | --- | ----------------------------- |
{productId}/option-groups
|     |     | M   | Setstocklevelandthreshold |
| --- | --- | --- | ------------------------- |
PUT /merchant/products/
{productId}/inventory
| POST /merchant/products/ |     | M   | Recordastockmovement |
| ------------------------ | --- | --- | -------------------- |
{productId}/inventory/adjustments
| GET /merchant/products/ |     | M   | Stockhistory |
| ----------------------- | --- | --- | ------------ |
{productId}/inventory/movements
GET /merchant/orders,GET / M Orderqueue(filterbystatus)anddetail
merchant/orders/{orderId}
PATCH /merchant/orders/{orderId}/ M ACCEPTED,REJECTED(reasonrequired),
| status |     |     | PREPARING,READY_FOR_PICKUP, |
| ------ | --- | --- | --------------------------- |
COMPLETED(pickuporders)
| GET /merchant/settlements |     | M   | Ledgerentriesandpayablebalance |
| ------------------------- | --- | --- | ------------------------------ |
Page34of62

| EPADASH-BE-ARCH-001 |     |     | Version0.2—Revisedaftertechnicalreview |
| ------------------- | --- | --- | -------------------------------------- |
Table27. Orderandpaymentendpoints(customer)
| Methodandpath |     | Access | Purpose |
| ------------- | --- | ------ | ------- |
POST /orders/quote C Validateandpriceabasket: subtotal,deliveryfee,
total,availabilityanddeliveryeligibility
| POST /orders    |                   | C   | Placeanorder(Idempotency-Keyrequired) |
| --------------- | ----------------- | --- | ------------------------------------- |
| GET /orders,GET | /orders/{orderId} | C   | Ownorderhistoryanddetail              |
POST /orders/{orderId}/cancel C CancelwhiletheorderisPENDING_PAYMENTor
PLACED
GET /orders/{orderId}/tracking C Statushistory,deliverystatus,latestriderlocation
andestimate
POST /orders/{orderId}/payments C Startanonlinepayment(Idempotency-Keyrequired)
|     |     | C,A | Paymentstatus |
| --- | --- | --- | ------------- |
GET /payments/{paymentId}
POST /webhooks/paystack P(signed) Paymentprovidereventreceiver
Table28. Rideranddeliveryendpoints
| Methodandpath |     | Access | Purpose                                |
| ------------- | --- | ------ | -------------------------------------- |
|               |     | R      | Registeranuploadedverificationdocument |
POST /rider/documents
| PATCH /rider/availability |     | R   | GoAVAILABLEorOFFLINE           |
| ------------------------- | --- | --- | ------------------------------ |
| POST /rider/location      |     | R   | Sendalocationpoint             |
| GET /rider/offers         |     | R   | Currentopendeliveryoffer,ifany |
|                           |     | R   | Respondtoanoffer               |
POST /rider/offers/{assignmentId}/
accept,.../reject
| GET /rider/deliveries,GET | /rider/ | R   | Activeandpastdeliveries |
| ------------------------- | ------- | --- | ----------------------- |
deliveries/{deliveryId}
| POST /rider/deliveries/ |     | R   | Arrivedatthemerchant(AT_PICKUP) |
| ----------------------- | --- | --- | ------------------------------- |
{deliveryId}/arrived
POST /rider/deliveries/ R Ordercollected(PICKED_UP);allowedonlywhen
| {deliveryId}/pickup |     |     | theorderisREADY_FOR_PICKUP |
| ------------------- | --- | --- | -------------------------- |
POST /rider/deliveries/ R Completewiththecustomerconfirmationcodeand
| {deliveryId}/deliver    |     |     | optionalproofphoto               |
| ----------------------- | --- | --- | -------------------------------- |
| POST /rider/deliveries/ |     | R   | Reportafaileddeliverywithareason |
{deliveryId}/fail
| GET /rider/earnings |     | R   | Earningssummaryandhistory |
| ------------------- | --- | --- | ------------------------- |
Page35of62

| EPADASH-BE-ARCH-001 |     |     | Version0.2—Revisedaftertechnicalreview |
| ------------------- | --- | --- | -------------------------------------- |
Table29. Notificationendpoints
| Methodandpath |     | Access | Purpose |
| ------------- | --- | ------ | ------- |
GET /notifications Any Ownin-appnotifications(cursorpaginated;filter
unread)
| PATCH /notifications/ |     | Any | Markonenotificationread |
| --------------------- | --- | --- | ----------------------- |
{notificationId}/read
|     |     | Any | Markallnotificationsread |
| --- | --- | --- | ------------------------ |
POST /notifications/read-all
GET /notifications/preferences,PUT Any Readandreplacechannelandcategorypreferences
/notifications/preferences
Table30. Administrationandsystemendpoints
| Methodandpath |     | Access | Purpose |
| ------------- | --- | ------ | ------- |
GET /admin/merchants,GET /admin/ A Reviewmerchants(filterbystatus)
merchants/{merchantId}
|     |     | A   | Approve,suspend,reactivateorclose |
| --- | --- | --- | --------------------------------- |
PATCH /admin/merchants/
{merchantId}/status
GET /admin/riders,PATCH /admin/ A Reviewdocuments;approveorrejectarider
riders/{riderId}/verification
| GET /admin/orders,GET | /admin/ | A   | Allorderswithfilters |
| --------------------- | ------- | --- | -------------------- |
orders/{orderId}
PATCH /admin/orders/{orderId}/ A Overridestatuswithareason(audited)
status
| GET /admin/payments               |     | A   | Paymentswithfilters(status,date,order) |
| --------------------------------- | --- | --- | -------------------------------------- |
| POST /admin/payments/{paymentId}/ |     | A   | Fullorpartialrefund                    |
refunds
|     |     | A   | Monitordeliveries;filterunassignedandfailed |
| --- | --- | --- | ------------------------------------------- |
GET /admin/deliveries
| POST /admin/deliveries/ |     | A   | Manuallyassignorreassignarider |
| ----------------------- | --- | --- | ------------------------------ |
{deliveryId}/assign
GET/POST/PATCH/DELETE /admin/ A Managemerchantandproductcategories
categories
GET /admin/settings,PUT /admin/ SUPER_ Platformconfiguration(fees,timeouts,radius)
| settings |     | ADMIN |     |
| -------- | --- | ----- | --- |
GET /admin/reports/summary A Orders,revenue,activemerchantsandridersfora
daterange
| GET /admin/audit-logs       |     | A   | Searchtheaudittrail        |
| --------------------------- | --- | --- | -------------------------- |
| POST /admin/cod-remittances |     | A   | Recordcashremittedbyarider |
Page36of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
| Methodandpath   |        | Access | Purpose                    |
| --------------- | ------ | ------ | -------------------------- |
| GET /health,GET | /ready | P      | Livenessandreadinessprobes |
9.6 Corerequestandresponsestructures
Theexamplesbelowfixtheshapeoftheprincipalcontracts;allotherendpointsfollowthesameconven-
tions,andthefullschemasaregeneratedintotheOpenAPIdocument.
| Register(POST | /auth/register),request: |     |     |
| ------------- | ------------------------ | --- | --- |
{
| "role":      | "CUSTOMER",        |     |     |
| ------------ | ------------------ | --- | --- |
| "email":     | "ama@example.com", |     |     |
| "phone":     | "+233200000002",   |     |     |
| "password":  | "S3cure!pass",     |     |     |
| "firstName": | "Ama",             |     |     |
| "lastName":  | "Mensah"           |     |     |
}
Register,response(201):
{
| "data":   | {                       |     |     |
| --------- | ----------------------- | --- | --- |
| "userId": | "uuid",                 |     |     |
| "status": | "PENDING_VERIFICATION", |     |     |
"verification": { "channel": "SMS", "expiresInSeconds": 600 }
},
| "meta": | { "requestId": | "request-id" | }   |
| ------- | -------------- | ------------ | --- |
}
| Login(POST | /auth/login),response(200): |     |     |
| ---------- | --------------------------- | --- | --- |
{
| "data":         | {         |     |     |
| --------------- | --------- | --- | --- |
| "accessToken":  | "jwt",    |     |     |
| "expiresIn":    | 900,      |     |     |
| "refreshToken": | "opaque", |     |     |
"user": { "id": "uuid", "role": "CUSTOMER", "firstName": "Ama", "status": "
| ACTIVE" | }   |     |     |
| ------- | --- | --- | --- |
},
| "meta": | { "requestId": | "request-id" | }   |
| ------- | -------------- | ------------ | --- |
}
Page37of62

| EPADASH-BE-ARCH-001  |              | Version0.2—Revisedaftertechnicalreview |     |
| -------------------- | ------------ | -------------------------------------- | --- |
| Merchantlistitem(GET | /merchants): |                                        |     |
{
"id": "uuid",
| "slug": "mama-efua-kitchen", |                  |                       |     |
| ---------------------------- | ---------------- | --------------------- | --- |
| "businessName":              | "Mama Efua       | Kitchen",             |     |
| "categories":                | [{ "id": "uuid", | "name": "Restaurants" | }], |
| "isOpen": true,              |                  |                       |     |
| "rating": 4.6,               |                  |                       |     |
| "ratingCount":               | 128,             |                       |     |
| "distanceKm":                | 2.4,             |                       |     |
| "minOrderAmount":            | 30.00,           |                       |     |
| "deliveryFeeFrom":           | 10.00,           |                       |     |
| "estimatedMinutes":          | 30               |                       |     |
}
| Placeanorder(POST | /orders),request: |     |     |
| ----------------- | ----------------- | --- | --- |
{
| "merchantId":    | "uuid",         |     |     |
| ---------------- | --------------- | --- | --- |
| "fulfilment":    | "DELIVERY",     |     |     |
| "addressId":     | "uuid",         |     |     |
| "paymentMethod": | "MOBILE_MONEY", |     |     |
| "items": [       |                 |     |     |
{ "productId": "uuid", "quantity": 2, "optionIds": ["uuid"], "note": "Less
| pepper" | }   |     |     |
| ------- | --- | --- | --- |
],
| "customerNote": | "Call on | arrival" |     |
| --------------- | -------- | -------- | --- |
}
Page38of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
Placeanorder,response(201):
{
"data": {
"id": "uuid",
"orderNumber": "EPD-261108-100001",
"status": "PENDING_PAYMENT",
"paymentStatus": "PENDING",
"fulfilment": "DELIVERY",
"items": [
{ "productName": "Jollof Rice", "unitPrice": 50.00, "quantity": 2, "
lineTotal": 100.00 }
],
"subtotal": 100.00,
"deliveryFee": 10.00,
"serviceFee": 2.00,
"discountTotal": 0.00,
"taxTotal": 0.00,
"total": 112.00,
"currency": "GHS",
"expiresAt": "2026-11-08T10:30:00Z"
}
}
Startpayment(POST /orders/{orderId}/payments),requestandresponse:
{ "method": "MOBILE_MONEY", "callbackUrl": "https://app.example.com/pay/return"
}
{
"data": {
"paymentId": "uuid",
"status": "PENDING",
"amount": 112.00,
"currency": "GHS",
"reference": "EPD-PAY-8f2c1a",
"authorizationUrl": "https://checkout.example/..."
}
}
Page39of62

| EPADASH-BE-ARCH-001 |                 |     |     | Version0.2—Revisedaftertechnicalreview |
| ------------------- | --------------- | --- | --- | -------------------------------------- |
| Deliveryoffer(GET   | /rider/offers): |     |     |                                        |
{
| "data":         | {   |                         |     |     |
| --------------- | --- | ----------------------- | --- | --- |
| "assignmentId": |     | "uuid",                 |     |     |
| "deliveryId":   |     | "uuid",                 |     |     |
| "expiresAt":    |     | "2026-11-08T10:15:45Z", |     |     |
"pickup": { "name": "Mama Efua Kitchen", "latitude": 5.556, "longitude":
| -0.183              | },   |             |                     |           |
| ------------------- | ---- | ----------- | ------------------- | --------- |
| "dropoff":          | {    | "latitude": | 5.570, "longitude": | -0.175 }, |
| "distanceKm":       |      | 3.1,        |                     |           |
| "estimatedMinutes": |      | 18,         |                     |           |
| "earning":          | 8.00 |             |                     |           |
}
}
| Tracking(GET | /orders/{orderId}/tracking): |     |     |     |
| ------------ | ---------------------------- | --- | --- | --- |
{
| "data":           | {   |                     |     |     |
| ----------------- | --- | ------------------- | --- | --- |
| "orderStatus":    |     | "OUT_FOR_DELIVERY", |     |     |
| "deliveryStatus": |     | "PICKED_UP",        |     |     |
"rider": { "firstName": "Kofi", "vehicleType": "MOTORBIKE" },
"location": { "latitude": 5.562, "longitude": -0.179, "recordedAt":
| "2026-11-08T10:21:10Z" |     |                         | },  |     |
| ---------------------- | --- | ----------------------- | --- | --- |
| "estimatedArrival":    |     | "2026-11-08T10:32:00Z", |     |     |
| "confirmationCode":    |     | "4821"                  |     |     |
}
}
| 10 Core | business | workflows |     |     |
| ------- | -------- | --------- | --- | --- |
10.1 Merchantandproductdiscovery
Visibility rules. A merchant is publicly visible when status = ACTIVE and deleted_at IS NULL. A
productispubliclyvisiblewhenstatus PUBLISHED,deleted_at NULLanditsmerchantispublicly
|     |     |     | =   | IS  |
| --- | --- | --- | --- | --- |
visible. Draft, archived, deleted and pending items are never returned by public endpoints, and every
publicqueryappliesthesepredicatesintherepository,notinthecontroller.
Openandavailable. TheisOpenflagreturnedtoclientsistrueonlywhenthemerchant’smanualswitch
(is_open)isonandthecurrenttime,evaluatedinthemerchant’stimezone,fallsinsideoneoftheday’s
merchant_hours. Closed merchants remain listed with isOpen = false so customers can browse, but
orderstothemarerefusedwithMERCHANT_CLOSED.Apublishedproductwithis_available = falseis
returnedasunavailableandcannotbeordered.
Searchandfiltering. qmatchescase-insensitivelyagainstmerchantname,merchantcategorynamesand
productnameusingtrigramindexes(minimumtwocharacters). categoryIdfiltersbycategory,including
childcategories. city filters bymerchant city. When lat and lng are supplied, sort=distance orders
Page40of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
byHaversinedistanceanddistanceKmisreturned. deliversTo(coordinates)keepsonlymerchantswith
anactivedeliveryzonewhosemax_distance_kmcoversthedistance,andreturnstheapplicabledelivery
fee. Thedefaultsortisratingdescendingthenname;everylistispaginatedwithastablesecondarysort
onid.
10.2 Ordercreation
1. Authenticatethecustomer,checktheaccountisACTIVEandchecktheIdempotency-Key;arepeated
keyreturnstheoriginalorder.
2. Loadthemerchant: itmustbepubliclyvisible,open,andaccepttherequestedfulfilmenttype.
3. Loadeveryproduct: eachmustbelongtothatmerchantandbepublishedandavailable;validatese-
lectedoptionsagainsttheoption-groupminimumandmaximum;quantityperitemmustbebetween
1and50.
4. For DELIVERY orders load the customer’s own address, compute the distance to the merchant and
selectthesmallestactivedeliveryzonethatcoversit;otherwisereturnOUTSIDE_DELIVERY_AREA.
5. Calculate prices on the server (formula below) and verify the merchant’s minimum order amount
(BELOW_MIN_ORDER).
6. Inonetransaction: inserttheorderwithitsitemsnapshotsandtheaddresssnapshot, insertthefirst
order_status_historyrow,reservestockfortrackedproducts,andwriteanoutboxevent.
7. Online-paymentordersarecreatedasPENDING_PAYMENTwithexpires_atset15minutesahead;cash-
on-deliveryordersarecreateddirectlyasPLACED.
Pricingformula. Thefinalunitpriceistheproductpriceplustheprice_deltaoftheselectedoptions.
Then:
line_total = unit_price x quantity;subtotal = sum of line_total;delivery_fee=feeofthe
selected zone (zero for pickup); service_fee = round(subtotal x SERVICE_FEE_RATE, 2); total
= subtotal + delivery_fee + service_fee + tax_total - discount_total. Promotions are out-
side the first release (discount_total = 0) and tax_total follows a configured rate that defaults to
zero.
Stock handling (D11). For products with track_inventory = true: order creation increases
quantity_reserved (movement RESERVATION); reaching PLACED converts the reservation into a
sale (quantity_on_hand and quantity_reserved both decrease; movement SALE); cancellation, re-
jectionorexpirybeforethatpointreleasesthereservation(movementRELEASE).Acancellationafter
the sale is recorded as a RETURN movement only when the merchant confirms the goods were not
prepared.
Page41of62

| EPADASH-BE-ARCH-001 |     |     | Version0.2—Revisedaftertechnicalreview |
| ------------------- | --- | --- | -------------------------------------- |
10.3 Orderstatuslifecycle
Table31. Orderstatustransitions
| From | To  | Actor | Sideeffectsandguards |
| ---- | --- | ----- | -------------------- |
(new) PENDING_ Customer(online Stockreserved;expires_at=now+15
|     | PAYMENT | payment) | minutes |
| --- | ------- | -------- | ------- |
(new) PLACED Customer(cashon Stockreservedandcommitted;merchant
|     |     | delivery) | notified |
| --- | --- | --------- | -------- |
PENDING_ PLACED System,onverified Stockcommitted;CHARGEledgerentry;
| PAYMENT  |           | payment           | merchantandcustomernotified |
| -------- | --------- | ----------------- | --------------------------- |
| PENDING_ | CANCELLED | Customer,orsystem | Stockreleased               |
| PAYMENT  |           | atexpires_at      |                             |
PLACED ACCEPTED Merchant Deliveryrecordcreatedanddispatchstarted
(deliveryorders);customernotified
PLACED REJECTED Merchant,reason Stockreleased;automaticrefundifpaid;
|     |     | required | customernotified |
| --- | --- | -------- | ---------------- |
PLACED CANCELLED Customer,orsystem Stockreleased;automaticrefundifpaid
ifthemerchantdoes
notrespondwithin
10minutes
| ACCEPTED | PREPARING | Merchant | Customernotified |
| -------- | --------- | -------- | ---------------- |
PREPARING READY_FOR_ Merchant Assignedridernotified;pickupbecomes
|     | PICKUP |     | allowed |
| --- | ------ | --- | ------- |
READY_FOR_ OUT_FOR_ Riderconfirms Confirmationcodeissuedtothecustomer;
| PICKUP | DELIVERY | pickup(delivery | trackingvisible |
| ------ | -------- | --------------- | --------------- |
orders)
| READY_FOR_ | COMPLETED | Merchant(pickup | Ledgerentrieswritten |
| ---------- | --------- | --------------- | -------------------- |
| PICKUP     |           | orders)         |                      |
OUT_FOR_ COMPLETED Riderconfirms Riderearningandmerchantpayableentries;
DELIVERY deliverywiththe cashcollectionrecordedforcashondelivery
customercode
ACCEPTED, CANCELLED Administratoronly, Deliverycancelled;refundandstock
PREPARING, reasonrequired handlingdecidedbytheadministrator;all
| READY_FOR_ |     |     | partiesnotified |
| ---------- | --- | --- | --------------- |
PICKUP,OUT_
FOR_DELIVERY
AnyothertransitionreturnsINVALID_STATE_TRANSITION.Everytransitionisacompare-and-setupdate
inside a transaction that also writes order_status_history and an outbox event. Cash on delivery is
| availableonlyfordeliveryorders. | Figure9showsthelifecycle. |     |     |
| ------------------------------- | ------------------------- | --- | --- |
Page42of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
customerortimeout
PENDING_PAYMENT
paymentverified
merchantrejects customerornoresponse
REJECTED PLACED
merchantaccepts
administrator
ACCEPTED
merchantstartspreparing
administrator
PREPARING
merchantmarksready
administrator
READY_FOR_PICKUP
riderconfirmspickup
pickuporders: administrator
OUT_FOR_DELIVERY
merchantcompletes
riderconfirmsdelivery
CANCELLED
COMPLETED
Figure9. Orderstatuslifecycle.
Page43of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
10.4 Paymentprocessing
Payment model. A payment is one attempt to pay for one order. An order may have several payments
(retries)butatmostonewithstatusSUCCESS.Onlinepaymentsusetheprovider’shostedcheckout(D3),
so card and mobile-money details are entered on the provider’s page and never reach EpaDash servers.
The payment row stores the provider reference, the amount and currency calculated by the server, the
idempotencykeyandasanitisedcopyoftheproviderresponse. orders.payment_statusalwaysmirrors
thelatestrelevantpayment.
Table32. Paymentstatustransitions
From To Trigger
(new) PENDING PaymentinitiatedforanorderinPENDING_PAYMENT
PENDING SUCCESS Webhookorreconciliationverifiesasuccessfultransactionwith
matchingreference,amountandcurrency
PENDING FAILED Providerreportsfailure,verificationmismatch,orprovider
initialisationerror
PENDING CANCELLED Customerabandonsthepaymentandtheorderexpiresoris
cancelled
SUCCESS PARTIALLY_ Arefundsmallerthantheamountsucceeds
REFUNDED
SUCCESSor REFUNDED Refundssucceedforthefullamount
PARTIALLY_
REFUNDED
Onlinepaymentsequence. Figure10showstheexchange. TheclientaskstheAPItostartapayment;the
APIvalidatesthattheorderbelongstothecallerandisinPENDING_PAYMENT,createsaPENDINGpayment,
initialises a transaction with the provider using a unique reference, and returns the checkout URL. The
customerpaysontheprovider’spage. Theproviderthencallsthewebhookendpoint;theAPIverifiesthe
eventand,inonedatabasetransaction,marksthepaymentSUCCESS,movestheordertoPLACED,commits
the stock reservation, writes the CHARGE ledger entry and writes the outbox events for notifications.
The client learns the result by polling GET /payments/{paymentId} or from the push notification; the
browserredirectbackfromtheproviderisnevertreatedasproofofpayment.
Webhookverification. Thewebhookendpointreadstherawrequestbody,verifiestheprovidersignature
(HMAC) before any processing, stores the event in payment_webhook_events (a repeated event ID is
acknowledged and ignored), then confirms the transaction status directly with the provider and checks
reference, amount and currency against the stored payment. Only then is state changed. The endpoint
returnsasuccessresponsequicklyanddoesheavyworkthroughthequeue(Figure11).
Reconciliation. Ascheduledjobrunsevery5minutesandverifieswiththeprovidereverypaymentthat
hasbeenPENDINGformorethan10minutes,soalostwebhookneverleavesapaidorderunconfirmed. A
dailyjobcomparesprovidersettlementrecordswiththeledgerandraisesanadministratoralertforany
difference.
Page44of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
Payment
Customerapp API Database
provider
Payfororder
(Idempotency-Key)
Validateorder;
createpayment(PENDING)
Initialisetransaction
(reference,amount,currency)
AuthorisationURL
AuthorisationURL
Customerpaysontheprovider’shostedcheckout
Signedwebhookevent
Verifytransaction
Onetransaction:paymentSUCCESS,
orderPLACED,stockcommitted,
ledgerentry,outboxevents
Status(pollingorpush)
Figure10. Onlinepaymentinitiationandconfirmationsequence.
Page45of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
Providercallback/webhookreceived
| Signature/         | No  | Reject;orderand       |
| ------------------ | --- | --------------------- |
| authenticityvalid? |     | paymentstateunchanged |
Yes
| Eventalreadyprocessed |     | Acknowledge;no |
| --------------------- | --- | -------------- |
Yes
| (idempotencykey)? |     | furtherprocessing |
| ----------------- | --- | ----------------- |
No
Verifytheprovidertransaction
statuswiththeprovider
| Providerconfirms   | No  | Recordverificationoutcome; |
| ------------------ | --- | -------------------------- |
| successfulpayment? |     | donotmarktheorderpaid      |
Yes
Storeproviderreference
andverificationoutcome
Updatepaymentstate
andorderpaymentstatus
Acknowledgewebhook
Figure11. Paymentwebhookverificationandidempotentprocessing.
Page46of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
Refunds. Afullrefundiscreatedautomaticallywhenanorderisrejectedorcancelledafterasuccessful
payment. Administratorscanissuefullorpartialrefundswithareason. Theservicecreatesarefundsrow
(PENDING),callstheproviderrefundAPI,andonsuccesswritesaREFUNDledgerentryandupdatesthe
paymentstatus;failuresareretriedthreetimeswithback-offandthenappearintheadministratorqueue.
Thesumofsuccessfulrefundscanneverexceedthepaymentamount.
Ledgerandsettlement. Everymoneymovementisanimmutablerowintransactions. Amountsowed
aretrackedbycreditanddebitrows,socorrectingorpayingoutnevereditshistory.
Table33. Ledgerentries
Event Ledgerentries Notes
Paymentsucceeds CHARGE,CREDIT,ordertotal Providerreferencestored
OrderCOMPLETED MERCHANT_PAYOUT,CREDIT,subtotal - Commissionissubtotal x
commission;RIDER_PAYOUT,CREDIT,rider_ merchants.commission_rate;
earning;PLATFORM_FEE,CREDIT,remainder thethreeentriessumtothe
CHARGEamountwhentax
anddiscountarezero
Refundsucceeds REFUND,DEBIT,refundamount Linkedtotherefundand
payment
Fundspaidtoamerchant MERCHANT_PAYOUTorRIDER_PAYOUT, Payablebalanceiscredits
orrider DEBIT,amountpaid minusdebits
Cashcollectedon COD_COLLECTION,CREDIT,ordertotal Riderowestheplatformthis
delivery cash
Riderremitscash COD_COLLECTION,DEBIT,amountremitted Recordedbyanadministrator;
riderearningmaybenetted
In the first release the system calculates and records payable balances; disbursing funds is an oper-
ational finance step (manual transfer or the provider’s payout API, which is an extension point of
PaymentProvider).
Cashondelivery. ApaymentrowwithmethodCASH_ON_DELIVERYandstatusPENDINGiscreatedwhen
the order is placed. When the rider confirms delivery, the payment becomes SUCCESS and the COD_
COLLECTION entry is written. If the delivery fails or the order is cancelled, the payment becomes
CANCELLED.
Failurehandling.
Page47of62

| EPADASH-BE-ARCH-001 |     |     | Version0.2—Revisedaftertechnicalreview |
| ------------------- | --- | --- | -------------------------------------- |
Table34. Paymentfailurehandling
| Scenario | Handling |     |     |
| -------- | -------- | --- | --- |
Customerabandonsthe Atexpires_attheworkercancelsthepaymentandtheorderandreleasesthe
| payment | stock |     |     |
| ------- | ----- | --- | --- |
Paymentdeclined PaymentbecomesFAILED;theorderstaysPENDING_PAYMENTuntilit
expiresandthecustomermaystartanewpayment
Webhooklostordelayed Reconciliationjobverifiesthepaymentwiththeprovider
Duplicateorreplayedwebhook Unique(provider,eventID)makesprocessingidempotent;theeventis
acknowledgedwithoutchange
Amount,currencyorreference PaymentbecomesFAILEDwithamismatchreason,analertisraisedandthe
| mismatch | orderisnotplaced |     |     |
| -------- | ---------------- | --- | --- |
Paymentsucceedsafterthe Anautomaticfullrefundiscreatedandthecustomerisnotified
orderwascancelledorexpired
Providerunavailableat PAYMENT_FAILEDisreturnedandnopaymentisleftpending;thecustomer
| initialisation | retries |     |     |
| -------------- | ------- | --- | --- |
Refundfails Retriedwithback-off,thenescalatedtotheadministratorqueue
| Newpaymentonanalready | RejectedwithCONFLICT |     |     |
| --------------------- | -------------------- | --- | --- |
paidorder
Securitycontrols. Carddataisneverstoredorlogged;theintegrationremainswithintheprovider-hosted,
tokenisedflow. Providersecretsareheldinthesecretstoreanddifferbetweentestandliveenvironments.
Webhook signatures are verified on the raw body, and the provider’s published source addresses may
additionallybeallow-listed. Amountsarealwayscalculatedserver-side. Paymentinitiationandrefunds
areaudited.
10.5 Deliverymanagement
Deliveryrecord. Fordeliveryordersadeliveriesrowiscreatedwhenthemerchantacceptstheorder.
Itstoresthepickupcoordinates(merchant),thedrop-offcoordinates(addresssnapshot),thedistance,the
| deliveryfeeandtheriderearning. |     | Pickupordersnevercreateadelivery. |     |
| ------------------------------ | --- | --------------------------------- | --- |
Table35. Deliverystatustransitions
| From  | To         | Actor  | Guardandeffect                 |
| ----- | ---------- | ------ | ------------------------------ |
| (new) | UNASSIGNED | System | CreatedwhentheorderisACCEPTED; |
dispatchstarts
UNASSIGNED ASSIGNED Rideracceptsan Deliveryrowlocked;riderset;riderbecomes
|     |     | offer,or | BUSY |
| --- | --- | -------- | ---- |
administrator
assigns
Page48of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
From To Actor Guardandeffect
ASSIGNED UNASSIGNED Ridercancels,or AssignmentclosedasCANCELLED;rider
administrator released;dispatchrestarts
reassigns
ASSIGNED AT_PICKUP Assignedrider Arrivalatthemerchantrecorded
AT_PICKUP PICKED_UP Assignedrider OnlywhentheorderisREADY_FOR_
PICKUP;orderbecomesOUT_FOR_
DELIVERY
PICKED_UP DELIVERED Assignedrider Correctconfirmationcode;orderbecomes
COMPLETED;riderbecomesAVAILABLE
PICKED_UP FAILED Assignedrider Reasonrequired;administratordecidesthe
outcome
UNASSIGNED, CANCELLED Systemor Ordercancelled;riderreleasedandnotified
ASSIGNED,AT_ administrator
PICKUP
Dispatchalgorithm(D12). Figure12showstheexchange.
1. A candidate rider must be APPROVED, have availability AVAILABLE, have a location newer than 120
seconds, be within the search radius of the merchant (5 km, widened to 8 km after the first round),
andhavenoopenofferoractivedelivery.
2. Candidates are ranked by distance to the merchant using the Haversine distance; the travel time of
the best three may be refined with the mapping provider. Ties are broken by the longest time since
therider’slastdelivery.
3. Thebestcandidatereceivesanoffer: adelivery_assignmentsrow(OFFERED)thatexpiresafter45
seconds,deliveredbypushnotificationandvisiblethroughGET /rider/offers.
4. Onaccept,onetransactionlocksthedeliveryrow(FOR UPDATE),verifiesitisstillUNASSIGNEDandthe
offerisstillopen,setstherider,markstheofferACCEPTED,setstheriderBUSYandwritestheoutbox
events. AsecondrideransweringlatereceivesINVALID_STATE_TRANSITION.
5. On reject or expiry the offer is closed and the next candidate is offered, up to five offers per round.
Ifnooneaccepts,theworkerretriesevery60secondsfor10minutesandthenplacesthedeliveryin
theadministratorqueueformanualassignmentorcancellation.
Locationandtracking. WhileariderisAVAILABLEtheappsendsalocationevery30seconds; during
an active delivery every 5 seconds. Each update is validated (coordinate ranges, accuracy, plausible
speed), written to riders.current_* and, during a delivery, appended to delivery_tracking. Cus-
tomers read the latest point and estimated arrival through GET /orders/{orderId}/tracking (version
1polling,D10). Ariderwithnolocationfor5minutesduringanactivedeliveryraisesanalert.
Pickup and handover. A rider may mark AT_PICKUP on arrival but cannot mark PICKED_UP until the
merchant has set the order to READY_FOR_PICKUP. When the order becomes OUT_FOR_DELIVERY a four-
digitconfirmationcodeisgenerated,storedhashedindeliveriesandshowntothecustomer;therider
Page49of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
APIand
Merchantapp Database Riderapp
dispatcher
Acceptorder
OrderACCEPTED;
createdelivery(UNASSIGNED)
Selectnearest
eligiblerider
Createoffer
(OFFERED,expiresin45s)
Pushnotification:newoffer
Acceptoffer
Lockdelivery;assignrider;
offerACCEPTED;riderBUSY
Riderassigned
Assignmentconfirmed
Noacceptancewithin45s: offerEXPIREDandthe
nextcandidateisoffered.
Figure12. Riderdispatchandassignmentsequence.
Page50of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
mustenterittocompletethedelivery,andanoptionalproofphotocanbeattached. Fivewrongattempts
flagthedeliveryforadministratorreview.
Deliveryfeeandriderearning. Thecustomer’sdeliveryfeeisthefeeofthesmallestcoveringdelivery
zone (set at order creation and stored on the order and delivery). The rider earning is delivery_fee x
RIDER_FEE_SHARE(default80percent);bothvaluesareplatformsettings.
Deliveryconfigurationdefaults.
Table36. Deliveryconfigurationdefaults(platformsettings)
| Setting        | Default     | Notes                      |
| -------------- | ----------- | -------------------------- |
| Offerexpiry    | 45seconds   | Peroffer                   |
| Searchradius   | 5km,then8km | Aroundthemerchant          |
| Offersperround | 5           | Thenretryevery60secondsfor |
10minutes
| Locationfreshnessfordispatch | 120seconds      | Ridermustberecent |
| ---------------------------- | --------------- | ----------------- |
| Locationinterval             | 30savailable,5s | Clientbehaviour   |
ondelivery
| Maximumconcurrentdeliveriesperrider            | 1              |             |
| ---------------------------------------------- | -------------- | ----------- |
| Confirmationattempts                           | 5              | Thenflagged |
| Customerwaitbeforeafaileddeliverymaybereported | 10minutes      |             |
| Riderfeeshare                                  | 80percentofthe |             |
deliveryfee
Failure,cancellationandreassignment.
Page51of62

| EPADASH-BE-ARCH-001 |     |          | Version0.2—Revisedaftertechnicalreview |     |
| ------------------- | --- | -------- | -------------------------------------- | --- |
| Scenario            |     | Handling |                                        |     |
Table37. Deliveryexceptions
| Scenario |     | Handling |     |     |
| -------- | --- | -------- | --- | --- |
Riderrejectsortheofferexpires OfferclosedasREJECTEDorEXPIRED;thenextcandidateisoffered
Norideraccepts DeliverystaysUNASSIGNED,appearsintheadministratorqueue;
administratorassignsmanuallyorcancelstheorder
Ridercancelsafteraccepting AssignmentbecomesCANCELLED,deliveryreturnstoUNASSIGNED,
dispatchrestarts;theeventisrecordedandrepeatedcancellationsareflagged
Riderstopssendinglocation Alertafter5minutes;administratormayreassign
duringadelivery
Customerunreachableat AfterthewaitingperiodtheriderreportsFAILEDwithareason;theorder
drop-off staysOUT_FOR_DELIVERYuntiltheadministratordecidesredelivery,
returnorrefund
Ordercancelledbyan DeliverybecomesCANCELLED;riderreleasedandnotified
administratorduringdelivery
Wrongconfirmationcode Attemptcounted;afterfiveattemptsthedeliveryisflagged
ridercancelsoradminreassigns
accepted
rider
|            | orassigned | riderarrives | collects  | codeverified |
| ---------- | ---------- | ------------ | --------- | ------------ |
| UNASSIGNED | ASSIGNED   | AT_PICKUP    | PICKED_UP | DELIVERED    |
customerunreachableordeliveryfails
ordercancelled
CANCELLED FAILED
(alsofromAT_PICKUP)
| Figure13. | Deliverystatuslifecycle. |     |     |     |
| --------- | ------------------------ | --- | --- | --- |
10.6 Notifications
Table38. Notificationevents
| Event                          |     | Recipients        | Channels               |     |
| ------------------------------ | --- | ----------------- | ---------------------- | --- |
| Verificationcode,passwordreset |     | User              | SMSoremail(alwayssent) |     |
| Orderplaced                    |     | Merchant,customer | Push,in-app            |     |
Orderaccepted,preparing,ready, Customer Push,in-app;SMSforrejectionand
rejected,cancelled cancellation
Page52of62

| EPADASH-BE-ARCH-001 | Version0.2—Revisedaftertechnicalreview |             |
| ------------------- | -------------------------------------- | ----------- |
| Event               | Recipients                             | Channels    |
| Deliveryoffer       | Rider                                  | Push,in-app |
Riderassigned,pickedup,delivered Customer,merchant Push,in-app
| Paymentsuccess,failure,refund | Customer       | Push,email   |
| ----------------------------- | -------------- | ------------ |
| Merchantapprovedorsuspended   | Merchantowner  | Email,in-app |
| Riderverifiedorrejected       | Rider          | SMS,in-app   |
| Deliveryunassignedorfailed,   | Administrators | In-app,email |
paymentmismatch
Domainchangeswriteanoutbox_eventsrowinthesametransactionasthechange. Theworkerreads
pending events, creates notifications rows for each recipient and channel allowed by the user’s pref-
erences (security messages ignore preferences), and sends them through the provider adapters. Failed
sends are retried five times with exponential back-off (30 seconds, 2 minutes, 10 minutes, 30 minutes,
2 hours) and then marked FAILED; invalid push tokens are removed. Notification failure never changes
orderorpaymentstate,andmessagepayloadscontainidentifiersratherthansensitivedata.
10.7 Administrationandaudit
Administrators approve and suspend merchants and riders, suspend and reactivate users, manage cate-
goriesandplatformsettings,monitorandreassigndeliveries,issuerefunds,recordcashremittancesand
viewreports. Thefollowingactionsalwayswriteanaudit_logsrowwiththeactor,role,entity,oldand
newvalues,IPaddressanduseragent: accountstatuschanges,merchantandriderapprovaldecisions,or-
derstatusoverrides,refunds,riderassignmentoverrides,platformsettingchanges,administratorcreation
andpermission-sensitivereadsofriderdocuments.
Figure14summarisestheend-to-endworkflowthattheworkflowtestsinSection13exercise.
Page53of62

| EPADASH-BE-ARCH-001 |                                              | Version0.2—Revisedaftertechnicalreview |     |
| ------------------- | -------------------------------------------- | -------------------------------------- | --- |
| 1. Ordercreation.   | Validatecustomer,merchanteligibility,product |                                        |     |
publicationandavailability,quantities,priceanddeliveryeligibility;
recalculatepricesserver-side.
2. Orderpersistence. Persisttheorderanditempricesnapshots
transactionally;applytheapprovedstockreservationrule.
| 3. Paymentattempt. | Createapaymentattemptassociatedwiththe |     |     |
| ------------------ | -------------------------------------- | --- | --- |
order.
Notificationevents
4. Paymentverification. Verifytheprovidercallback/webhook
Orderupdates,payment
(signatureandprovidertransactionstatus)beforemarkingtheorder
result,riderassignment
paid.
anddeliveryupdates.
Notificationfailuremust
notsilentlycorrupt
5. Riderassignment. Createthedeliveryrecordandassignarider orderorpaymentstate.
whoiseligibleandavailableunderapprovedrules.
| 6. Deliveryprogress. | Assignedrider(orauthorisedadministrator) |     |     |
| -------------------- | ---------------------------------------- | --- | --- |
updatesdeliverystate;transitionsandtrackingeventsarerecorded.
7. Deliverycompletion.
| Figure14.      | End-to-endworkflowfromordercreationtodeliverycompletion. |              |     |
| -------------- | -------------------------------------------------------- | ------------ | --- |
| 11 Third-party | integration                                              | requirements |     |
11.1 Integrationsummary
| Table39. Third-partyintegrations |                    |          |                  |
| -------------------------------- | ------------------ | -------- | ---------------- |
| Integration                      | Requiredcapability | Boundary | Baselinedecision |
Payment Initiatepayment,verify PaymentProvideradapter Paystackhostedcheckout(D3);
provider status,receivesigned andprovider-specific sandboxandlivekeysper
|     | webhooks,refund,support | webhookverifier | environment |
| --- | ----------------------- | --------------- | ----------- |
reconciliation
Mapping Geocodeaddresses,distance MappingProvideradapter; GoogleMapsPlatform(D4)with
and andtravel-timeestimates, providerpayloadsneverenter Haversinefallback
| geolocation | delivery-zonesupport | thedomainmodel |     |
| ----------- | -------------------- | -------------- | --- |
Notifications Push,SMSandemailfor NotificationProvider FirebaseCloudMessagingfor
accountandorderevents adapterscalledbytheworker push;SMSandemailproviders
selectedperenvironment(D5)
Fileand Merchantandproduct Storageadapterwith S3-compatibleobjectstorage(D9)
| media   | images,riderdocuments | presigneduploadsand   |     |
| ------- | --------------------- | --------------------- | --- |
| storage |                       | validatedfilemetadata |     |
Donothard-codeproviderselectionintobusinessservices. Usesandboxcredentialsduringdevelopment,
Page54of62

| EPADASH-BE-ARCH-001 |     |     |     |     | Version0.2—Revisedaftertechnicalreview |     |
| ------------------- | --- | --- | --- | --- | -------------------------------------- | --- |
keepcredentialsinsecretconfiguration,verifywebhookscryptographically,andapplytimeouts, retries
withback-offandidempotencytoeveryoutboundcall.
11.2 Adaptercontracts
Eachintegrationisconsumedthroughanarrowinterface,soaprovidercanbereplacedwithoutchanging
businesslogicortheAPI.
| interface | PaymentProvider |     | {   |     |     |     |
| --------- | --------------- | --- | --- | --- | --- | --- |
initializeTransaction(input: { reference: string; amountMinor: number;
| currency: |     | string; |     |     |     |     |
| --------- | --- | ------- | --- | --- | --- | --- |
email: string; callbackUrl: string; metadata?: Record<string, string> }):
Promise<{ authorizationUrl: string; providerReference: string }>;
| verifyTransaction(reference: |     |     |     | string): |     |     |
| ---------------------------- | --- | --- | --- | -------- | --- | --- |
Promise<{ status: 'SUCCESS' | 'FAILED' | 'ABANDONED' | 'PENDING';
|     | amountMinor: |     | number; | currency: | string; paidAt?: | Date }>; |
| --- | ------------ | --- | ------- | --------- | ---------------- | -------- |
verifyWebhookSignature(rawBody: Buffer, signature: string): boolean;
parseWebhookEvent(rawBody: Buffer): { eventId: string; type: string; reference
| :   | string }; |     |     |     |     |     |
| --- | --------- | --- | --- | --- | --- | --- |
refund(input: { reference: string; amountMinor: number; reason?: string }):
Promise<{ providerRefundId: string; status: 'PENDING' | 'SUCCESS' | 'FAILED'
}>;
}
| interface        | MappingProvider |          | {   |     |     |     |
| ---------------- | --------------- | -------- | --- | --- | --- | --- |
| geocode(address: |                 | string): |     |     |     |     |
Promise<{ latitude: number; longitude: number; formattedAddress: string } |
null>;
travelEstimates(origin: Coordinates, destinations: Coordinates[]):
| Promise<{ | distanceKm: |     | number; | durationMinutes: | number }[]>; |     |
| --------- | ----------- | --- | ------- | ---------------- | ------------ | --- |
}
| interface | NotificationProvider |         |            | {   |     |     |
| --------- | -------------------- | ------- | ---------- | --- | --- | --- |
| channel:  | 'PUSH'               | | 'SMS' | | 'EMAIL'; |     |     |     |
send(message: { to: string; title?: string; body: string; data?: Record<string
| ,         | string>            | }): |     |            |     |     |
| --------- | ------------------ | --- | --- | ---------- | --- | --- |
| Promise<{ | providerMessageId: |     |     | string }>; |     |     |
}
11.3 Paymentgatewayrequirements
• Hostedcheckoutsupportingcardsandmobilemoney,andasandboxenvironmentforautomatedand
manualtesting.
• Server-side transaction initialisation with a unique merchant reference, amount in minor units and
currency,andacallbackURL.
• Server-sidetransactionverificationbyreference,returningstatus,amountandcurrency.
• Signed webhooks for charge and refund events with a verifiable signature header and stable event
Page55of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
identifiers.
• RefundAPI(fullandpartial)andsettlementreportsforreconciliation.
• Separatetestandlivesecretkeys;keysareneverexposedtoclientsorlogs.
• The provider fee structure and settlement schedule are recorded in platform settings so that ledger
reportscanshowthem;theadapteristheonlycodethatknowsprovider-specificfieldnames.
11.4 Mappingrequirements
• Geocode customer and merchant addresses when they are saved; store the coordinates with the ad-
dresssothatordinaryrequestsdonotcalltheprovider.
• Useprovidertravelestimatesonlytorefinedispatchrankingandcustomerarrivalestimates;delivery
zonechecksandfeesusethestoredcoordinatesandHaversinedistance,soorderingstillworksifthe
providerisunavailable.
• RestrictAPIkeysbyserviceandorigin,cachegeocodingresults,setquotasandalertsonusage,and
keepproviderpayloadsoutofthedomainmodel.
• Treat rider location as personal data: collect it only while a rider is available or on a delivery, and
applytheretentionperiodinSection6.7.
11.5 Notificationrequirements
• Channels: in-app (database), push through Firebase Cloud Messaging for Android, iOS and web,
SMSforverificationcodesandcriticalalerts,andemailforreceiptsandaccountmessages.
• Templates are stored in code with variables, versioned, and support localisation; sender identities
(SMSsenderID,emaildomainwithSPFandDKIM)areconfiguredperenvironment.
• Delivery is asynchronous through the queue with retry and a stored delivery status (Section 10.6);
userpreferencesapplyexceptforsecuritymessages.
• Push token lifecycle: tokens are registered per device, refreshed on use and removed when the
providerreportstheminvalid.
11.6 Fileandmediastorage
• Clients upload directly to object storage using presigned URLs obtained from POST /uploads/
presign;theAPIneverstreamslargefiles.
• Allowedimagetypesandamaximumsize(5MBbydefault)arevalidatedwhentheURLisissued
andagainwhentheobjectkeyisregistered.
• Product and merchant images are served from a public path or CDN; rider verification documents
arestoredprivatelyandreadonlythroughshort-livedsignedURLsbyadministrators.
Page56of62

| EPADASH-BE-ARCH-001 |     |     | Version0.2—Revisedaftertechnicalreview |
| ------------------- | --- | --- | -------------------------------------- |
11.7 Configurationandsecrets
Table40. Principalconfigurationvariables
| Variable                        |     | Purpose                        |     |
| ------------------------------- | --- | ------------------------------ | --- |
| DATABASE_URL                    |     | PostgreSQLconnectionstring     |     |
| JWT_ACCESS_SECRET,ACCESS_TOKEN_ |     | Tokensigningsecretandlifetimes |     |
TTL,REFRESH_TOKEN_TTL
| DEFAULT_CURRENCY |     | ISO4217currencycodeofthedeployment |     |
| ---------------- | --- | ---------------------------------- | --- |
PAYSTACK_SECRET_KEY,PAYSTACK_ Paymentprovidercredentials(testandlivediffer)
WEBHOOK_SECRET
| MAPS_API_KEY                      |     | Mappingprovidercredential       |     |
| --------------------------------- | --- | ------------------------------- | --- |
| FCM_CREDENTIALS,SMS_PROVIDER_KEY, |     | Notificationprovidercredentials |     |
EMAIL_PROVIDER_KEY
| STORAGE_BUCKET,STORAGE_ACCESS_KEY, |     | Objectstorage |     |
| ---------------------------------- | --- | ------------- | --- |
STORAGE_SECRET_KEY
| CORS_ALLOWED_ORIGINS              |     | Approvedfrontendorigins          |     |
| --------------------------------- | --- | -------------------------------- | --- |
| SERVICE_FEE_RATE,RIDER_FEE_SHARE, |     | Initialvaluesforplatformsettings |     |
ORDER_PAYMENT_TIMEOUT_MIN
All variables are validated with Zod at start-up; secrets are supplied by the environment or a secret
managerandnevercommitted.
| 12 Security, | privacy and | operational | requirements |
| ------------ | ----------- | ----------- | ------------ |
12.1 Securityandprivacy
• HTTPS/TLSoutsidelocaldevelopment,withHSTS.
• Strictrequestvalidationandsafeoutputencoding.
• Authenticationandresource-levelauthorisationonprotectedendpoints.
• Ratelimitingandabuseprotectionforsensitiveendpoints(Table22).
• CORS allow-list based on approved frontend origins; no permissive wildcard configuration with
credentials.
• Secureheadersandregulardependencyupdateswithautomatedvulnerabilityscanning.
• Environment-basedsecrets;least-privilegedatabasecredentialswithseparatemigrationandapplica-
tionroles;theapplicationrolecannotalterordeleteledgerandauditrows.
• StructuredlogswithrequestIDsandredactionofsecretsandpersonaldata.
• Auditrecordsforprivilegedactionsandsensitivestatetransitions.
• Backupsandrestoretestingappropriatetothehostingenvironment.
Page57of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
• Databasemigrationsreviewedandruninacontrolleddeploymentprocess.
• Avoidunnecessarypersonaldatacollection;retentionanddeletionfollowSection6.7andtheorgan-
isation’spolicy.
• Payment-cardhandlingremainswithacompliantprovider-hosted,tokenisedflow.
• Error messages must not disclose whether a particular account exists during password recovery or
login.
12.2 Non-functionaltargets
Table41. Initialnon-functionaltargets
Attribute Target
Availability 99.5percentmonthlyfortheAPI
Latency 95thpercentileunder300msforreadendpointsandunder800msforwrite
endpoints,excludingcallstoexternalproviders
Initialsizing 5,000ordersperdayand500ridersreportinglocation(about100locationwrites
persecondatpeak);tobevalidatedbyloadtestingbeforelaunch
Recovery Recoverypointobjectiveof15minuteswithpoint-in-timerecovery;recovery
timeobjectiveof4hours;restoretestedeveryquarter
Security OWASPAPISecurityTop10controlsverifiedbyautomatedandmanualtests
beforerelease
Observability RequestIDoneverylogline;errortracking;metricsforlatency,errorrate,queue
depth,paymentanddispatchoutcomes;alertsonpaymentmismatches,stuck
queuesandunassigneddeliveries
12.3 Environmentsanddeliveryprocess
• Environments: local(DockerCompose),automatedtest,stagingandproduction,eachwithseparate
databases,secretsandprovidersandboxorlivecredentials.
• Continuousintegration: oneverypullrequestrunlint,typecheck,unitandintegrationtestsagainst
aPostgreSQLservice,migrationchecksonanemptydatabase,andOpenAPIvalidation.
• Deployment: build one container image from the repository; run migrations as a separate release
step; run the API and worker processes from the same image; use health and readiness probes for
rollout.
• Operations: daily automated backups with point-in-time recovery, log retention of 30 days online,
andrunbooksforpaymentreconciliationdifferences,stuckqueuesandunassigneddeliveries.
Page58of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
13 Testing and quality strategy
• Unit tests: service rules, state transitions, permission decisions, price calculation, stock arithmetic
andavailabilityrules.
• APIintegrationtests: routes,middleware,validation,statuscodesandresponsecontractsagainsta
realPostgreSQLtestdatabase.
• Database tests: migrations, constraints, transactions, partial unique indexes and repository be-
haviouragainstPostgreSQL.
• Security tests: unauthenticated access, forbidden role, cross-user access, cross-merchant access,
tokenexpiryandrevocation,refreshreusedetectionandrate-limitbehaviour.
• Provider tests: adapter contract tests and sandbox tests; do not rely only on mocked provider re-
sponses.
• Concurrencytests: last-itemstockcontention,simultaneousrideracceptance,duplicatewebhooks
andduplicateordersubmissions.
• Workflowtests: ordercreation→paymentverification→riderassignment→deliverycompletion,
includingrejection,cancellation,refundandfailed-deliverypaths.
• Documentationchecks: theOpenAPIdocumentvalidatesandmatchestheimplementedendpoints.
Acceptance evidence includes reproducible test commands and test results. A feature is not complete
solelybecauseitsrouteexists. Thetargetisatleast80percentlinecoverageofserviceanddomaincode
andapassingtestforeverytransitioninTable31,Table32andTable35.
Page59of62

EPADASH-BE-ARCH-001 Version0.2—Revisedaftertechnicalreview
| 14 Proposed | repository | structure |
| ----------- | ---------- | --------- |
epadash-backend/
|-- docs/
| | |-- architecture/ |                                  |     |
| ------------------- | -------------------------------- | --- |
| | | |--             | backend-technical-spec.md        |     |
| | | `--             | architecture-context.mmd         |     |
| | |-- database/     |                                  |     |
| | | |--             | database-design.md               |     |
| | | `--             | erd.mmd                          |     |
| | |-- api/          |                                  |     |
| | | `--             | openapi.yaml                     |     |
| | |-- workflows/    |                                  |     |
| | |-- decisions/    |                                  |     |
| | | `--             | ADR-0001-initial-architecture.md |     |
| | `-- reports/      |                                  |     |
|-- prisma/
| | |-- schema.prisma |     |     |
| ------------------- | --- | --- |
| | |-- migrations/   |     |     |
| | `-- seed.ts       |     |     |
|-- src/
| | |-- config/     |                |     |
| ----------------- | -------------- | --- |
| | |-- middleware/ |                |     |
| | |-- common/     |                |     |
| | |-- worker/     |                |     |
| | `-- modules/    |                |     |
| | |--             | auth/          |     |
| | |--             | users/         |     |
| | |--             | merchants/     |     |
| | |--             | products/      |     |
| | |--             | inventory/     |     |
| | |--             | orders/        |     |
| | |--             | payments/      |     |
| | |--             | riders/        |     |
| | |--             | deliveries/    |     |
| | |--             | notifications/ |     |
| | `--             | admin/         |     |
|-- tests/
|-- .env.example
|-- .gitignore
|-- package.json
`-- README.md
Thisstructuremaybeadjustedtocompanyconventionswithoutweakeningmoduleseparation,testability
or secret handling. Each module folder contains its routes, controller, service, repository, schemas and
tests.
Page60of62

| EPADASH-BE-ARCH-001 |         |     |     | Version0.2—Revisedaftertechnicalreview |     |
| ------------------- | ------- | --- | --- | -------------------------------------- | --- |
| 15 Implementation   | roadmap |     |     |                                        |     |
The assignment tasks that follow this specification take their content directly from Section 6, Section 9
and Section 10: the detailed database deliverables (Prisma schema, migrations, seed scripts and ERD)
andtheAPIdeliverables(OpenAPIfileandworkflowdocuments)areproducedfromthisbaselinewithout
furtherarchitecturaldecisions.
| Table42. Implementationphases |     |     |                |     |              |
| ----------------------------- | --- | --- | -------------- | --- | ------------ |
| Phase Scope                   |     |     | Assignmenttask |     | Exitcriteria |
P0 Repository,CI,configuration,logging,error All CIpasses;migrationsapplyto
| model,Prismabaseline,healthendpoints |     |     |     |     | anemptydatabase |
| ------------------------------------ | --- | --- | --- | --- | --------------- |
P1 Authentication,sessions,users,roles,RBAC, Coreservicesand Authenticationandpermission
| accountlifecycle |     |     | authentication |     | testspass |
| ---------------- | --- | --- | -------------- | --- | --------- |
P2 Categories,merchants,products,public Merchant Visibilityandsearchtestspass;
| discoveryendpoints |     |     | discoveryand |     | OpenAPIpublished |
| ------------------ | --- | --- | ------------ | --- | ---------------- |
catalogue
P3 Quote,ordercreation,stockreservation,order Orderprocessing Orderandconcurrencytests
| lifecycle |     |     |     |     | pass |
| --------- | --- | --- | --- | --- | ---- |
P4 Paymentinitiation,webhooks,reconciliation, Payments Sandboxend-to-endpayment
| refunds,ledger |     |     |     |     | passes;idempotencytestspass |
| -------------- | --- | --- | --- | --- | --------------------------- |
P5 Rideronboarding,dispatch,tracking,handover, Delivery Dispatchandexceptiontests
| earnings |     |     | management |     | pass |
| -------- | --- | --- | ---------- | --- | ---- |
P6 Outboxworker,notificationproviders, Notificationsand Notificationretrytestspass;
administration,audit,reports administration auditcoverageverified
P7 Loadandsecuritytesting,backuprestoretest, Quality TargetsinSection12.2met
documentation
| 16 Delivery                                 | and approval | checklist              | — Task | 5   |        |
| ------------------------------------------- | ------------ | ---------------------- | ------ | --- | ------ |
| Table43. Task5acceptancecriteriaandevidence |              |                        |        |     |        |
| No. Acceptancecriterionfrom                 |              | Evidenceinthisdocument |        |     | Status |
assignment
| 1 Backendtechnologystackdocumented |     | Sections2.3and3 |     |     | Complete |
| ---------------------------------- | --- | --------------- | --- | --- | -------- |
| 2 Backendsystemarchitecturedefined |     | Section4        |     |     | Complete |
| 3 Coresystemmodulesidentified      |     | Section5        |     |     | Complete |
4 Majorentitiesandrelationships Section6(36entities,relationship Complete
| outlined |     | matrix,diagrams) |     |     |     |
| -------- | --- | ---------------- | --- | --- | --- |
Page61of62

| EPADASH-BE-ARCH-001         |     |                        | Version0.2—Revisedaftertechnicalreview |        |
| --------------------------- | --- | ---------------------- | -------------------------------------- | ------ |
| No. Acceptancecriterionfrom |     | Evidenceinthisdocument |                                        | Status |
assignment
| 5 Customer,merchant,riderand |     | Section7 |     | Complete |
| ---------------------------- | --- | -------- | --- | -------- |
administratorrolesdefined
| 6 Authenticationandauthorisation |     | Sections7and8 |     | Complete |
| -------------------------------- | --- | ------------- | --- | -------- |
documented
| 7 APIrequirementsidentified |     | Sections9and10 |     | Complete |
| --------------------------- | --- | -------------- | --- | -------- |
8 Payment,mappingandnotification Sections10.4,10.5and11 Complete
integrationsdocumented
9 Technicalspecificationsubmittedfor Thisdocument(revision2) Submitted;approval
| approval |     |     |     | pending |
| -------- | --- | --- | --- | ------- |
Approvalitems
1. ApprovethebaselinedecisionsD1toD13inTable3,ornamethedecisiontobereplaced.
2. Approve the default values of the platform settings (timeouts, radii, fee rates) or supply company
values;theyareconfiguration,notarchitecture.
3. Confirmhosting,environment,secrets,backupanddeploymentrequirements.
4. Confirmdataretentionperiodsandanyjurisdiction-specificcompliancerequirements.
5. Reviewandapprovethistechnicalspecification.
Table44. Approvalrecord
| Role | Name |     | Decision | Date |
| ---- | ---- | --- | -------- | ---- |
Technicallead
Developer
Frontend/APIconvention
review
Document status reminder: This is the revised technical specification for Task 5. It is not proof of
approval,implementation,deploymentorcompletedacceptancetesting.
Page62of62