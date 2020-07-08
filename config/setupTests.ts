import React from 'react';
import { mockInsights } from '@redhat-cloud-services/insights-common-typescript';

declare const global: any;
global.React = React;
mockInsights();
