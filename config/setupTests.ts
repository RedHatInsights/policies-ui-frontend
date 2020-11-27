import React from 'react';
import { mockInsights } from 'insights-common-typescript-dev';

declare const global: any;
global.React = React;
mockInsights();
