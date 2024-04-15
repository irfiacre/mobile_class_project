//
//  AmbientLightSensor.m
//  rnclassproject
//
//  Created by IRADUKUNDA Allelua Fiacre on 14/04/2024.
//

#import <Foundation/Foundation.h>

@objc(AmbientLightSensor)
class AmbientLightSensor: NSObject {
    
    private let motionManager = CMMotionManager()
    
    @objc func getAmbientLight(_ callback:RCTResponseSenderBlock) {
        if motionManager.isAmbientLightAvailable {
            motionManager.startAmbientLightUpdates()
            if let lightData = motionManager.ambientLight {
                let lightValue = lightData.illumination
                callback([nil, lightValue])
            } else {
                callback(["Error reading ambient light", nil])
            }
        } else {
            callback(["Ambient light sensor not available", nil])
        }
    }
}
