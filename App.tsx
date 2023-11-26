import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Platform } from 'react-native';

// axios request functions
import { getData, post, removeData, storeData, get, put, del } from 'utils';

// constants
import { TOKEN_KEY, USER_DATA_KEY, ENDPOINT } from 'utils';

// react-native-paper hooks
import { useTheme } from 'react-native-paper';

// react-native-paper components
import {
  TextInput,
  Banner,
  Text,
  Button,
  Divider,
  Card,
} from 'react-native-paper';

const App = () => {
  const theme = useTheme();

  const [bannerVisible, setBannerVisible] = useState(true);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState({
    accessToken: '없음',
    refreshToken: '없음',
  });
  const [postResult, setPostResult] = useState('통신 전');
  const [getResult, setGetResult] = useState('통신 전');
  const [putResult, setPutResult] = useState('통신 전');
  const [delResult, setDelResult] = useState('통신 전');

  // 토큰 발급
  const requestToken = useCallback(async () => {
    try {
      const response = await post(ENDPOINT.auth.login, { id, password });
      const { accessToken, refreshToken, ...userData } = response.data;

      // 토큰 저장(기기에)
      const tokenData = {
        accessToken,
        refreshToken,
      };
      await storeData(TOKEN_KEY, tokenData);
      setToken(tokenData);

      // 회원 정보 저장(기기에)
      await storeData(USER_DATA_KEY, userData);
    } catch (err) {
      console.warn(err);
    }
  }, [id, password]);

  // 기기에 있는 토큰 읽기
  const getTokenFromDevice = async () => {
    try {
      const response = await getData(TOKEN_KEY);
      if (response !== undefined) {
        setToken({
          ...response,
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // 토큰 제거
  const delToken = async () => {
    try {
      // 레디스에 저장된 토큰 제거
      await post(ENDPOINT.auth.logout);

      // 기기에 저장된 유저, 토큰 정보 제거
      await removeData(USER_DATA_KEY);
      await removeData(TOKEN_KEY);
      setToken({
        accessToken: '무효화됨',
        refreshToken: '무효화됨',
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const beautifyJsonString = (json: any) => {
    return JSON.stringify(json, null, 2);
  };

  // POST TEST
  const testPost = async () => {
    try {
      const response = await post(ENDPOINT.test.post);
      setPostResult(beautifyJsonString(response));
    } catch (err) {
      console.warn(err);
      setPostResult(beautifyJsonString(err));
    }
  };

  // GET TEST
  const testGet = async () => {
    try {
      const response = await get(ENDPOINT.test.get, {
        test: '테스트 파라미터 데이터',
      });
      setGetResult(beautifyJsonString(response));
    } catch (err) {
      console.warn(err);
      setGetResult(beautifyJsonString(err));
    }
  };

  // PUT TEST
  const testPut = async () => {
    try {
      const response = await put(ENDPOINT.test.put, {
        idx: 30, // 필수 데이터
      });
      setPutResult(beautifyJsonString(response));
    } catch (err) {
      console.warn(err);
      setPutResult(beautifyJsonString(err));
    }
  };

  // DELETE TEST
  const testDel = async () => {
    try {
      const response = await del(ENDPOINT.test.delete, {
        idx: 30, // 필수 데이터
      });
      setDelResult(beautifyJsonString(response));
    } catch (err) {
      console.warn(err);
      setDelResult(beautifyJsonString(err));
    }
  };

  useEffect(() => {
    getTokenFromDevice();
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text variant="displayLarge" style={[styles.headerTitle]}>
          Axios API
        </Text>
      </View>
      <Banner
        visible={bannerVisible}
        elevation={4}
        actions={[
          {
            label: '네, 확인했습니다.',
            onPress: () => setBannerVisible(false),
          },
        ]}
      >
        [허용된 사용자]{'\n'}
        ID: user{'\n'}
        PW: 1234{'\n'}
        {'\n'}
        [차단된 사용자]{'\n'}
        ID: blockeduser{'\n'}
        PW: 1234
      </Banner>
      <View style={[styles.container]}>
        <View style={[styles.pb23]}>
          <Card style={[styles.mb10]}>
            <Card.Content>
              <View style={[styles.mb10]}>
                <Text variant="bodyMedium">Access Token</Text>
                <Text variant="bodyMedium">{token.accessToken}</Text>
              </View>
              <Divider style={[styles.mb10]} />
              <View>
                <Text variant="bodyMedium">Refresh Token</Text>
                <Text variant="bodyMedium">{token.refreshToken}</Text>
              </View>
            </Card.Content>
          </Card>
          <TextInput
            label="아이디"
            value={id}
            style={[styles.mb10]}
            onChangeText={value => setId(value)}
            autoCapitalize="none"
          />
          <TextInput
            label="비밀번호"
            secureTextEntry
            value={password}
            style={[styles.mb10]}
            onChangeText={value => setPassword(value)}
            autoCapitalize="none"
          />
          <Button style={[styles.mb10]} mode="contained" onPress={requestToken}>
            토큰 강제 발급(로그인)
          </Button>
          <Button mode="outlined" onPress={delToken}>
            토큰 제거(로그아웃)
          </Button>
        </View>
        <Divider style={[styles.mb23]} />

        <View style={[styles.pb23]}>
          <View style={[styles.sectionTitleView, styles.mb10]}>
            <Text variant="headlineMedium">POST</Text>
            <Button mode="outlined" onPress={testPost}>
              통신
            </Button>
          </View>
          <Card>
            <Card.Content>
              <Text variant="bodyMedium">{postResult}</Text>
            </Card.Content>
          </Card>
        </View>

        <Divider style={[styles.mb23]} />

        <View style={[styles.pb23]}>
          <View style={[styles.sectionTitleView, styles.mb10]}>
            <Text variant="headlineMedium">GET</Text>
            <Button mode="outlined" onPress={testGet}>
              통신
            </Button>
          </View>
          <Card>
            <Card.Content>
              <Text variant="bodyMedium">{getResult}</Text>
            </Card.Content>
          </Card>
        </View>

        <Divider style={[styles.mb23]} />

        <View style={[styles.pb23]}>
          <View style={[styles.sectionTitleView, styles.mb10]}>
            <Text variant="headlineMedium">PUT</Text>
            <Button mode="outlined" onPress={testPut}>
              통신
            </Button>
          </View>
          <Card>
            <Card.Content>
              <Text variant="bodyMedium">{putResult}</Text>
            </Card.Content>
          </Card>
        </View>

        <Divider style={[styles.mb23]} />

        <View style={[styles.pb23]}>
          <View style={[styles.sectionTitleView, styles.mb10]}>
            <Text variant="headlineMedium">DELETE</Text>
            <Button mode="outlined" onPress={testDel}>
              통신
            </Button>
          </View>
          <Card>
            <Card.Content>
              <Text variant="bodyMedium">{delResult}</Text>
            </Card.Content>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f5f5f5',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 23,
    backgroundColor: '#f5f5f5',
    paddingBottom: 100,
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    paddingTop: Platform.select({
      ios: 100,
    }),
  },
  headerTitle: {
    color: '#ffffff',
  },
  mb10: {
    marginBottom: 10,
  },
  pb23: {
    paddingBottom: 23,
  },
  mb23: {
    marginBottom: 23,
  },
  sectionTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default App;
