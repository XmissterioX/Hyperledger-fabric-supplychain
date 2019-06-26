
const namespace = "org.turnkeyledger.tracefood";

/**
* Track the trade of a commodity from one trader to another
* @param {org.turnkeyledger.tracefood.MakeCrate} crateDetails - the trade to be processed
* @transaction
*/
async function makeCrate (crateDetails) {
   
  
    let factory = await getFactory();
    var NS = 'org.turnkeyledger.tracefood';
    var me = getCurrentParticipant();

    const crateReg = await getAssetRegistry(namespace + '.Crate');
  
  	var newCrate = factory.newResource(NS, 'Crate', 			crateDetails.crate.crateId);
  
  	newCrate = crateDetails.crate;
  
 	var newTrace = factory.newConcept(NS, 'Trace');
    newTrace.timestamp = new Date();
  	
  	if (crateDetails.address != null) {
    newTrace.location = crateDetails.address ;
    } else {
     newTrace.location = me.address;
    }
  	let  concepts = [];

  	concepts.push(newTrace);

  	newCrate.trace = concepts;

  	newCrate = crateDetails.crate;
  	newCrate.supplier = me;
  
	return getAssetRegistry(namespace + '.Crate')
    .then(function (assetRegistry) {
        return assetRegistry.add(newCrate);
  });
}






  /**
 * Track the trade of a commodity from one trader to another
 * @param {org.turnkeyledger.tracefood.AddTraceCrate} traceData - the trade to be processed
 * @transaction
 */
async function AddTraceCrate (traceData) {
  	
  	let crateId = traceData.crateId;
    
    let factory = await getFactory();
    var NS = 'org.turnkeyledger.tracefood';
    // var me = getCurrentParticipant();

    const crateReg = await getAssetRegistry(namespace + '.Crate');
 
    var crate = await crateReg.get(crateId);
	
    var newTrace = factory.newConcept(NS, 'Trace');
    newTrace.timestamp = new Date();
	newTrace.action = traceData.action;
  
  	if(traceData.location != null) {
    	newTrace.location = traceData.location;
    }
  	if(traceData.description != null) {
    	newTrace.location = traceData.location;
    }
  	if(traceData.campanyInvolved != null) {
    	newTrace.campanyInvolved = traceData.campanyInvolved;
    }

  	let  concepts = [];
  
  	concepts = crate.trace;

  	concepts.push(newTrace);

  	crate.trace = concepts;
    

    return getAssetRegistry(namespace + '.Crate')
    .then(function (assetRegistry) {
        return assetRegistry.update(crate);
  });
 }

  /**
 * Track the trade of a commodity from one trader to another
 * @param {org.turnkeyledger.tracefood.MakeOrder} orderData - the trade to be processed
 * @transaction
 */
async function MakeOrder (orderData) {
  // console.log(orderData.order);
  var factory = getFactory();
  var me = getCurrentParticipant();
  const orderReg = await getAssetRegistry(namespace + '.Order');
  const crateReg = await getAssetRegistry(namespace + '.Crate');
  var order = factory.newResource(namespace, 'Order', 			          	  	orderData.order.orderId);
  order = orderData.order;
  order.supplier = me;
  
  
  return getAssetRegistry('org.turnkeyledger.tracefood.Order')
        .then(function (assetRegistry) {
            return assetRegistry.add(orderData.order);
        }).then(function(){
            return getAssetRegistry('org.turnkeyledger.tracefood.Crate')
        })
        .then(function (assetRegistry) {
            return assetRegistry.updateAll(order.crates);
        });
   
  
 }

/**
     * Associate the Packcase to order
     * @param {org.turnkeyledger.tracefood.Acto} tx - the tx to be processed
     * @transaction
**/
function Acto(tx){
   if(tx.order.crates == null) {
        tx.order.crates  = []; // initialise
    }
  let  crates = [];
  crates.push(tx.crate);
  tx.order.crates.push(tx.crate);
  tx.crate.order = tx.order
  console.log(tx.order);
 return getAssetRegistry(namespace + '.Order')
    .then(function (assetRegistry) {
        return assetRegistry.update(tx.order);
  }).then(function(){
            return getAssetRegistry('org.turnkeyledger.tracefood.Crate')
        })
        .then(function (assetRegistry) {
            return assetRegistry.update(tx.crate);
        });
   
}