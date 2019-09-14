import * as AzureModule from '@azure/app-configuration'

import { FeatureManager, CachedEntry } from '../FeatureManager'
import { ImportMock } from 'ts-mock-imports'
import * as express from 'express'
import assert from 'assert'

describe('Feature manager', () => {

    it('should create a AppConfigurationClient with the provided connection string', () => {
        let testConnectionString = "TEST"

        ImportMock.mockClass(AzureModule, 'AppConfigurationClient')

        let featureManager = new FeatureManager(testConnectionString)

        assert.equal(featureManager.connectionString, testConnectionString)
        assert.notEqual(!featureManager.client, true)
    })

    describe('filterRoute', () => {

        it('should execute feature gated route if feature enabled', async () => {
            ImportMock.mockClass(AzureModule, 'AppConfigurationClient')
            let featureManager = new FeatureManager("TEST")
            let entry = <CachedEntry>{
                fetched: new Date(),
                value: true,
                key: "testKey"
            }
            featureManager.cache = {
                "testKey": entry
            }
            let whichRouteCalled = 0
            let req = <express.Request>{ url: 'sample req' }
            let res = <express.Response>{ statusCode: 999 }
            let next = function sampleNext() { }
            let outRequest, outResponse, outNext;

            let handler = featureManager.filterRoute('testKey',
                (rq, rs, nx) => {
                    whichRouteCalled = 1
                    outRequest = rq
                    outResponse = rs
                    outNext = nx
                },
                (rq, rs, nx) => {
                    whichRouteCalled = 2
                    outRequest = rq
                    outResponse = rs
                    outNext = nx
                })

            await handler(req, res, next)

            assert.equal(whichRouteCalled, 1, "should route to feature gated handler when feature is toggled on")
            assert.equal(outRequest, req, "should pass the same request its received")
            assert.equal(outResponse, res, "should pass the same response its received")
            assert.equal(outNext, next, "should pass the same next its received")
        })

        it('should execute old gated route if feature disabled', async () => {
            ImportMock.mockClass(AzureModule, 'AppConfigurationClient')
            let featureManager = new FeatureManager("TEST")
            let entry = <CachedEntry>{
                fetched: new Date(),
                value: false,
                key: "testKey"
            }
            featureManager.cache = {
                "testKey": entry
            }
            let whichRouteCalled = 0
            let req = <express.Request>{ url: 'sample req' }
            let res = <express.Response>{ statusCode: 999 }
            let next = function sampleNext() { }
            let outRequest, outResponse, outNext;

            let handler = featureManager.filterRoute('testKey',
                (rq, rs, nx) => {
                    whichRouteCalled = 1
                    outRequest = rq
                    outResponse = rs
                    outNext = nx
                },
                (rq, rs, nx) => {
                    whichRouteCalled = 2
                    outRequest = rq
                    outResponse = rs
                    outNext = nx
                })

            await handler(req, res, next)

            assert.equal(whichRouteCalled, 2, "should route to feature gated handler when feature is toggled on")
            assert.equal(outRequest, req, "should pass the same request its received")
            assert.equal(outResponse, res, "should pass the same response its received")
            assert.equal(outNext, next, "should pass the same next its received")
        })

        it('should execute old gated route if feature call errors out', async () => {
            ImportMock.mockClass(AzureModule, 'AppConfigurationClient')
            let featureManager = new FeatureManager("TEST")
            let oldConsoleError = console.error
            console.error = function() {}
            
            featureManager.feature = async () => {
                throw new Error('Boom!')
            }
            
            let whichRouteCalled = 0
            let req = <express.Request>{ url: 'sample req' }
            let res = <express.Response>{ statusCode: 999 }
            let next = function sampleNext() { }
            let outRequest, outResponse, outNext;

            let handler = featureManager.filterRoute('testKey',
                (rq, rs, nx) => {
                    whichRouteCalled = 1
                    outRequest = rq
                    outResponse = rs
                    outNext = nx
                },
                (rq, rs, nx) => {
                    whichRouteCalled = 2
                    outRequest = rq
                    outResponse = rs
                    outNext = nx
                })

            await handler(req, res, next)

            assert.equal(whichRouteCalled, 2, "should route to feature gated handler when feature is toggled on")
            assert.equal(outRequest, req, "should pass the same request its received")
            assert.equal(outResponse, res, "should pass the same response its received")
            assert.equal(outNext, next, "should pass the same next its received")
            
            console.error = oldConsoleError
        })

    })

    describe('feature', () => {

        it('should return pull from cache if within cache refresh limit', async () => {
            ImportMock.mockClass(AzureModule, 'AppConfigurationClient')
            let featureManager = new FeatureManager("TEST")
            let entry = <CachedEntry>{
                fetched: new Date(),
                value: true,
                key: "testKey"
            }

            featureManager.cache = {
                "testKey": entry
            }

            var result = await featureManager.feature('testKey')

            assert.equal(result, entry.value)

        })

        it('should pull from azure if exceeded cache refresh limit', async () => {
            let mock = ImportMock.mockClass<AzureModule.AppConfigurationClient>(AzureModule, 'AppConfigurationClient')
            let featureManager = new FeatureManager("TEST")
            let oldEntry = <CachedEntry>{
                fetched: new Date('2000-01-01'), // purposely old date
                value: false,
                key: "testKey"
            }
            
            mock.mock("getConfigurationSetting", Promise.resolve(<CachedEntry>{
                fetched: new Date(),
                key: "testKey",
                value: '{"enable": true}'
            }))

            featureManager.cache = {
                "testKey": oldEntry
            }

            var result = await featureManager.feature('testKey')

            assert.notEqual(result, oldEntry.value, "should return the new updated value")
            assert.notEqual(featureManager.cache['testKey'].value, oldEntry.value, "should store updated value into the cache")

        })

    })

})