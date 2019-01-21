import React, { PureComponent } from 'react';

class Login extends PureComponent {
    render() {
        return (
            <div className="container">
                <div className="row pt-4">
                    <div className="col-md-4 offset-md-2 border-right">
                        <h4>Đăng nhập</h4>
                        <div className="form-group">
                            <label htmlFor="username">Tài khoản:</label>
                            <input type="text" className="form-control" name="username" id="username" placeholder="Username"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Mật khẩu:</label>
                            <input type="password" className="form-control" name="password" id="password" placeholder="********"/>
                        </div>
                        <div className="form-group text-center">
                            <button className="btn btn-success"><i className="fa fa-sign-in"></i> Đăng nhập</button>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <h4 className="text-muted">Đăng nhập nhanh với</h4>
                        <button className="btn btn-block btn-danger"><i className="fa fa-google"></i> Google</button>
                        <button className="btn btn-block btn-primary"><i className="fa fa-facebook"></i> Facebook</button>
                        <h4 className="mt-3">Đăng ký chỉ với 3 phút!</h4>
                        <button className="btn btn-block btn-success"><i className="fa fa-user-circle-o"></i> Đăng ký</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;