# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: MIT-0

from tkinter import END
from awscrt import io, mqtt, auth, http
from awsiot import mqtt_connection_builder
import time as t
import json


def messageHandler(topic, payload):
    print('topic: ', topic, ' msg: ', payload)


class shackPubSub:
    def __init__(self,
                 ENDPOINT="a1yt3tbrz9zeyp-ats.iot.us-west-1.amazonaws.com",
                 CLIENT_ID="RaspberryPi",
                 PATH_TO_CERTIFICATE="./certs/1674118a67f74afc1c07d3a29f7e56913382835946dec05b002f74d42a100fd3-certificate.pem.crt",
                 PATH_TO_PRIVATE_KEY="./certs/1674118a67f74afc1c07d3a29f7e56913382835946dec05b002f74d42a100fd3-private.pem.key",
                 PATH_TO_AMAZON_ROOT_CA_1="./certs/AmazonRootCA1.pem",
                 TOPIC="autoshack",
                 messageHandler=messageHandler):
        self.topic = TOPIC
        event_loop_group = io.EventLoopGroup(1)
        host_resolver = io.DefaultHostResolver(event_loop_group)
        client_bootstrap = io.ClientBootstrap(event_loop_group, host_resolver)
        self.mqtt_connection = mqtt_connection_builder.mtls_from_path(
            endpoint=ENDPOINT,
            cert_filepath=PATH_TO_CERTIFICATE,
            pri_key_filepath=PATH_TO_PRIVATE_KEY,
            client_bootstrap=client_bootstrap,
            ca_filepath=PATH_TO_AMAZON_ROOT_CA_1,
            client_id=CLIENT_ID,
            clean_session=False,
            keep_alive_secs=6
        )
        connect_future = self.mqtt_connection.connect()
        connect_future.result()
        self.messageHandler = messageHandler

    def __del__(self):
        disconnect_future = self.mqtt_connection.disconnect()
        disconnect_future.result()

    def publishMessage(self, msg):
        self.mqtt_connection.publish(topic=self.topic, payload=json.dumps(
            msg), qos=mqtt.QoS.AT_LEAST_ONCE)

    def subscribeTopic(self, topic):
        self.mqtt_connection.subscribe(
            topic, qos=mqtt.QoS.AT_LEAST_ONCE, callback=self.messageHandler)
